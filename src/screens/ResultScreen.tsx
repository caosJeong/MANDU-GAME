import type { MandiResult } from "../game/scoring";
import type { HiddenRecipe } from "../game/recipes";
import type { AdOffers } from "../hooks/useAdTriggers";

export type RewardKind = "doublePoints" | "hiddenBonus" | "extraIngredients";

/**
 * 결과 화면이에요.
 * 정책대로 이 화면 진입 자체는 광고 없이 즉시 보여주고, 보상형 광고는 버튼으로만 제안해요.
 */
export function ResultScreen({
  results,
  basePoints,
  bonusPoints,
  offers,
  claimed,
  newHidden,
  adReady,
  onWatchAd,
  onReplay,
  onOpenCollection,
  onHome,
}: {
  results: MandiResult[];
  basePoints: number;
  bonusPoints: number;
  offers: AdOffers;
  claimed: Record<RewardKind, boolean>;
  newHidden: HiddenRecipe[];
  adReady: boolean;
  onWatchAd: (kind: RewardKind) => void;
  onReplay: () => void;
  onOpenCollection: () => void;
  onHome: () => void;
}) {
  const counts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.grade] = (acc[r.grade] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="screen screen--result">
      <h2 className="result-title">오늘 만든 만두</h2>

      <div className="grade-summary">
        {(["히든", "상", "중", "하"] as const).map((grade) => (
          <div key={grade} className={`grade-summary__item grade-summary__item--${grade}`}>
            <strong>{counts[grade] ?? 0}</strong>
            <span>{grade}</span>
          </div>
        ))}
      </div>

      <ul className="result-list">
        {results.map((result, i) => (
          <li key={i} className="result-list__row">
            <span className={`badge badge--${result.grade}`}>{result.grade}</span>
            <span className="result-list__name">
              {result.hidden ? `${result.hidden.emoji} ${result.hidden.name}` : `${i + 1}번째 만두`}
            </span>
            <span className="result-list__meta">
              {result.orderMatched ? "주문 적중" : "주문 빗나감"} · {result.points}P
            </span>
          </li>
        ))}
      </ul>

      {newHidden.length > 0 && (
        <div className="hidden-banner">
          🎉 새 히든 만두 {newHidden.length}종을 도감에 등록했어요!
          <span>{newHidden.map((r) => `${r.emoji} ${r.name}`).join(", ")}</span>
        </div>
      )}

      <div className="points-box">
        <span>획득 포인트</span>
        <strong>
          {basePoints + bonusPoints}P
          {bonusPoints > 0 && <em> (보너스 +{bonusPoints}P)</em>}
        </strong>
      </div>

      <div className="cta-stack">
        {offers.hiddenBonus && (
          <RewardButton
            kind="hiddenBonus"
            label="영상 보고 보너스 포인트 받기"
            note="도감 등록은 이미 완료됐어요"
            claimed={claimed.hiddenBonus}
            adReady={adReady}
            onWatchAd={onWatchAd}
          />
        )}
        {offers.doublePoints && (
          <RewardButton
            kind="doublePoints"
            label="광고 보고 포인트 2배 받기"
            note={`+${basePoints}P`}
            claimed={claimed.doublePoints}
            adReady={adReady}
            onWatchAd={onWatchAd}
          />
        )}
        {offers.extraIngredients && (
          <RewardButton
            kind="extraIngredients"
            label="광고 보고 다음 판 재료 슬롯 +1"
            note="다음 한 판에만 적용돼요"
            claimed={claimed.extraIngredients}
            adReady={adReady}
            onWatchAd={onWatchAd}
          />
        )}
      </div>

      <button type="button" className="primary-button" onClick={onReplay}>
        한 판 더
      </button>
      <div className="title-links">
        <button type="button" className="ghost-button" onClick={onOpenCollection}>
          📖 도감
        </button>
        <button type="button" className="ghost-button" onClick={onHome}>
          🏠 홈
        </button>
      </div>
    </div>
  );
}

function RewardButton({
  kind,
  label,
  note,
  claimed,
  adReady,
  onWatchAd,
}: {
  kind: RewardKind;
  label: string;
  note: string;
  claimed: boolean;
  adReady: boolean;
  onWatchAd: (kind: RewardKind) => void;
}) {
  return (
    <button
      type="button"
      className="reward-button"
      disabled={claimed || !adReady}
      onClick={() => onWatchAd(kind)}
    >
      <span className="reward-button__ad">광고</span>
      <span className="reward-button__label">{claimed ? "보상을 받았어요" : label}</span>
      <span className="reward-button__note">{claimed ? "" : adReady ? note : "광고 준비 중"}</span>
    </button>
  );
}
