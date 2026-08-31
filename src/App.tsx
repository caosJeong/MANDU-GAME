import { useCallback, useEffect, useMemo, useState } from "react";
import { TitleScreen } from "./screens/TitleScreen";
import { PlayScreen } from "./screens/PlayScreen";
import { ResultScreen, type RewardKind } from "./screens/ResultScreen";
import { CollectionScreen } from "./screens/CollectionScreen";
import { RankingScreen } from "./screens/RankingScreen";
import { BannerSlot } from "./ads/BannerSlot";
import type { ScreenId } from "./ads/policy";
import { useAdTriggers, type AdOffers } from "./hooks/useAdTriggers";
import { useRewardedAd } from "./hooks/useRewardedAd";
import { createOrders, type Order } from "./game/orders";
import type { HiddenRecipe } from "./game/recipes";
import type { MandiResult } from "./game/scoring";
import { loadSave, saveSave, type SaveData } from "./storage";
import { closeMiniApp, resolveUserId, useSafeAreaInsets } from "./platform";
import { playSound, unlockAudio } from "./game/sounds";
import { triggerHaptic } from "./game/haptics";
import "./App.css";

const HIDDEN_AD_BONUS = 30;
const NO_OFFERS: AdOffers = { doublePoints: false, hiddenBonus: false, extraIngredients: false };
const NO_CLAIMS: Record<RewardKind, boolean> = {
  doublePoints: false,
  hiddenBonus: false,
  extraIngredients: false,
};

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("title");
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [orders, setOrders] = useState<Order[]>([]);
  const [results, setResults] = useState<MandiResult[]>([]);
  const [newHidden, setNewHidden] = useState<HiddenRecipe[]>([]);
  const [basePoints, setBasePoints] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [offers, setOffers] = useState<AdOffers>(NO_OFFERS);
  const [claimed, setClaimed] = useState(NO_CLAIMS);
  /** 광고 보상으로 얻은 "다음 판 재료 슬롯 +1"이에요. */
  const [extraSlotNext, setExtraSlotNext] = useState(false);
  const [extraSlotThisRound, setExtraSlotThisRound] = useState(false);

  const insets = useSafeAreaInsets();
  const { rollOffers } = useAdTriggers();
  const ad = useRewardedAd();

  // 저장 데이터는 바뀔 때마다 그대로 보존해요 (정책: 플레이 기록 유지 필수).
  useEffect(() => {
    saveSave(save);
  }, [save]);

  // 토스 앱 안이면 익명 키를 유저 식별자로 승격해요.
  useEffect(() => {
    let cancelled = false;
    resolveUserId(save.userId).then((userId) => {
      if (!cancelled && userId !== save.userId) setSave((prev) => ({ ...prev, userId }));
    });
    return () => {
      cancelled = true;
    };
    // 최초 1회만 확인하면 돼요.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRound = useCallback(() => {
    unlockAudio();
    triggerHaptic("tap");
    setOrders(createOrders());
    setExtraSlotThisRound(extraSlotNext);
    setExtraSlotNext(false);
    setResults([]);
    setNewHidden([]);
    setBonusPoints(0);
    setClaimed(NO_CLAIMS);
    setScreen("play");
  }, [extraSlotNext]);

  const finishRound = useCallback(
    (roundResults: MandiResult[]) => {
      const earned = roundResults.reduce((sum, r) => sum + r.points, 0);
      const foundIds = roundResults
        .map((r) => r.hidden?.id)
        .filter((id): id is string => id != null);

      setSave((prev) => {
        const freshIds = foundIds.filter((id) => !prev.discovered.includes(id));
        return {
          ...prev,
          points: prev.points + earned,
          discovered: [...prev.discovered, ...freshIds],
          roundsPlayed: prev.roundsPlayed + 1,
          weekly: {
            ...prev.weekly,
            hiddenFound: prev.weekly.hiddenFound + freshIds.length,
            rounds: prev.weekly.rounds + 1,
            bestScore: Math.max(prev.weekly.bestScore, earned),
          },
        };
      });

      // 도감 등록은 광고와 무관하게 자동으로 끝나요 (기획서 3.3). 광고는 보너스 포인트만 줘요.
      const uniqueNew = roundResults
        .map((r) => r.hidden)
        .filter((r): r is HiddenRecipe => r != null && !save.discovered.includes(r.id));

      setResults(roundResults);
      setNewHidden(uniqueNew);
      setBasePoints(earned);
      setOffers(rollOffers(foundIds.length > 0));
      if (uniqueNew.length > 0) playSound("hidden");
      setScreen("result");
    },
    [rollOffers, save.discovered],
  );

  const watchAd = useCallback(
    (kind: RewardKind) => {
      const label =
        kind === "doublePoints"
          ? "결과 화면 포인트 2배"
          : kind === "hiddenBonus"
            ? "히든 발견 보너스"
            : "다음 판 재료 슬롯";

      ad.showAd(label, (rewardEarned) => {
        // 보상은 SDK의 userEarnedReward 이벤트가 확인된 경우에만 지급해요.
        if (!rewardEarned) return;
        setClaimed((prev) => ({ ...prev, [kind]: true }));

        if (kind === "doublePoints") {
          setBonusPoints((prev) => prev + basePoints);
          setSave((prev) => ({ ...prev, points: prev.points + basePoints }));
        } else if (kind === "hiddenBonus") {
          setBonusPoints((prev) => prev + HIDDEN_AD_BONUS);
          setSave((prev) => ({ ...prev, points: prev.points + HIDDEN_AD_BONUS }));
        } else {
          setExtraSlotNext(true);
        }
        triggerHaptic("success");
      });
    },
    [ad, basePoints],
  );

  const style = useMemo(
    () =>
      ({
        paddingTop: `max(env(safe-area-inset-top), ${insets.top}px)`,
        paddingBottom: `max(env(safe-area-inset-bottom), ${insets.bottom}px)`,
      }) as React.CSSProperties,
    [insets],
  );

  return (
    <div className="app" style={style}>
      <header className="app-header">
        {screen !== "title" ? (
          <button type="button" className="icon-button" onClick={() => setScreen("title")}>
            ← 홈
          </button>
        ) : (
          <span />
        )}
        {/* 정책: 모든 화면에서 미니앱 나가기 경로를 제공해요. */}
        <button type="button" className="icon-button" onClick={() => void closeMiniApp()}>
          나가기 ✕
        </button>
      </header>

      <main className="app-body">
        {screen === "title" && (
          <TitleScreen
            save={save}
            onStart={startRound}
            onOpenCollection={() => setScreen("collection")}
            onOpenRanking={() => setScreen("ranking")}
          />
        )}
        {screen === "play" && (
          <PlayScreen orders={orders} extraSlot={extraSlotThisRound} onFinish={finishRound} />
        )}
        {screen === "result" && (
          <ResultScreen
            results={results}
            basePoints={basePoints}
            bonusPoints={bonusPoints}
            offers={offers}
            claimed={claimed}
            newHidden={newHidden}
            adReady={ad.isLoaded}
            onWatchAd={watchAd}
            onReplay={startRound}
            onOpenCollection={() => setScreen("collection")}
            onHome={() => setScreen("title")}
          />
        )}
        {screen === "collection" && (
          <CollectionScreen save={save} onBack={() => setScreen("title")} />
        )}
        {screen === "ranking" && <RankingScreen save={save} onBack={() => setScreen("title")} />}
      </main>

      {/* 배너는 조작 영역 아래 고정 슬롯에만 붙고, 타이틀 화면에는 붙지 않아요. */}
      <BannerSlot screen={screen} />
    </div>
  );
}
