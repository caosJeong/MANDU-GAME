import { useCallback, useEffect, useMemo, useState } from "react";
import { TitleScreen } from "./screens/TitleScreen";
import { PlayScreen, type RoundInput } from "./screens/PlayScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { CollectionScreen } from "./screens/CollectionScreen";
import { BannerSlot } from "./ads/BannerSlot";
import type { ScreenId } from "./ads/policy";
import { useRewardedAd } from "./hooks/useRewardedAd";
import { judge, type Outcome } from "./game/recipe";
import { loadSave, nextHintId, saveSave, type SaveData } from "./storage";
import { resolveUserId, useSafeAreaInsets } from "./platform";
import { playSound, unlockAudio } from "./game/sounds";
import { triggerHaptic } from "./game/haptics";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("title");
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [input, setInput] = useState<RoundInput | null>(null);
  /** 이번 판에서 처음 만든 신메뉴인지예요 (결과 문구가 달라져요). */
  const [isNewMenu, setIsNewMenu] = useState(false);
  /** 이번 판에서 광고로 방금 알아낸 재료 id예요. 결과 화면에 바로 보여줘요. */
  const [revealedNow, setRevealedNow] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
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

  /** 화면을 옮기는 버튼은 전부 같은 누름 소리를 내요. */
  const go = useCallback((next: ScreenId) => {
    playSound("tap");
    triggerHaptic("tap");
    setScreen(next);
  }, []);

  const startRound = useCallback(() => {
    unlockAudio();
    triggerHaptic("tap");
    playSound("tap");
    setOutcome(null);
    setInput(null);
    setIsNewMenu(false);
    setRevealedNow(null);
    setScreen("play");
  }, []);

  const finishRound = useCallback((roundInput: RoundInput) => {
    const result = judge(roundInput.filling);
    const fresh = result.kind === "신메뉴" && !loadSave().discovered.includes(result.menu.id);

    setSave((prev) => ({
      ...prev,
      roundsPlayed: prev.roundsPlayed + 1,
      clearedRecipe: prev.clearedRecipe || result.kind === "정통",
      discovered:
        result.kind === "신메뉴" && !prev.discovered.includes(result.menu.id)
          ? [...prev.discovered, result.menu.id]
          : prev.discovered,
    }));

    setInput(roundInput);
    setOutcome(result);
    setIsNewMenu(fresh);
    if (result.kind === "정통") playSound("success");
    else if (result.kind === "신메뉴") playSound("newmenu");
    else playSound("fail");
    triggerHaptic(result.kind === "실패" ? "error" : "success");
    setScreen("result");
  }, []);

  const watchHintAd = useCallback(() => {
    playSound("tap");
    // 어떤 재료가 열렸는지 화면에 보여줘야 해서 id를 먼저 정해두고 저장해요.
    const id = nextHintId(save);
    if (!id) return;

    ad.showAd("정통 레시피 힌트", (rewardEarned) => {
      // 보상은 SDK의 userEarnedReward 이벤트가 확인된 경우에만 지급해요.
      if (!rewardEarned) return;
      setSave((prev) =>
        prev.revealed.includes(id) ? prev : { ...prev, revealed: [...prev.revealed, id] },
      );
      setRevealedNow(id);
      triggerHaptic("success");
    });
  }, [ad, save]);

  const style = useMemo(
    () =>
      ({
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: `max(env(safe-area-inset-bottom), ${insets.bottom}px)`,
      }) as React.CSSProperties,
    [insets.bottom],
  );

  return (
    <div className="app" style={style}>
      <main className="app-body">
        <div className="panel">
          {screen === "title" && (
            <TitleScreen onStart={startRound} onOpenCollection={() => go("collection")} />
          )}
          {screen === "play" && <PlayScreen onFinish={finishRound} />}
          {screen === "result" && outcome && input && (
            <ResultScreen
              outcome={outcome}
              input={input}
              save={save}
              isNewMenu={isNewMenu}
              adReady={ad.isLoaded}
              revealedNow={revealedNow}
              onWatchHintAd={watchHintAd}
              onReplay={startRound}
              onOpenCollection={() => go("collection")}
              onHome={() => go("title")}
            />
          )}
          {screen === "collection" && (
            <CollectionScreen save={save} onBack={() => go("title")} />
          )}
        </div>
      </main>

      {/* 배너는 조작 영역 아래 고정 슬롯에만 붙고, 타이틀 화면에는 붙지 않아요. */}
      <BannerSlot screen={screen} />
    </div>
  );
}
