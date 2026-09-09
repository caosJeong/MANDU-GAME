import { Cat } from "../components/Cat";
import { ingredientEmoji, ingredientName } from "../game/ingredients";
import { RECIPE, RECIPE_IDS, type Outcome } from "../game/recipe";
import { doughLabel } from "../stages/DoughStage";
import { shapeLabel } from "../stages/ShapeStage";
import type { RoundInput } from "./PlayScreen";
import type { SaveData } from "../storage";
import { hintProgress } from "../storage";

/**
 * 결과 화면이에요. 정통 / 신메뉴 / 실패 세 갈래로 갈려요.
 *
 * 정책대로 이 화면 진입 자체는 광고 없이 즉시 보여주고, 보상형 광고는 버튼으로만 제안해요.
 * 힌트 광고는 만두가 완성된 뒤인 여기에서만 제안해요 (재료 고를 때는 정답을 알려주지 않아요).
 */
export function ResultScreen({
  outcome,
  input,
  save,
  isNewMenu,
  adReady,
  revealedNow,
  onWatchHintAd,
  onReplay,
  onOpenCollection,
  onHome,
}: {
  outcome: Outcome;
  input: RoundInput;
  save: SaveData;
  isNewMenu: boolean;
  adReady: boolean;
  /** 방금 광고로 알아낸 재료 id. 있으면 버튼 대신 결과를 보여줘요. */
  revealedNow: string | null;
  onWatchHintAd: () => void;
  onReplay: () => void;
  onOpenCollection: () => void;
  onHome: () => void;
}) {
  const hints = hintProgress(save);
  const canHint = !save.clearedRecipe && hints.found < hints.total;
  const look = `${shapeLabel(input.shape, input.cook)} · ${doughLabel(input.dough)}`;

  return (
    <div className="screen screen--result">
      <div className="spacer" />

      <div className="result-hero">
        <Cat
          face={outcome.kind === "정통" ? "happy" : outcome.kind === "신메뉴" ? "surprised" : "sad"}
          width={118}
          mandu={outcome.kind === "실패" ? "#ded0bd" : "#f7dcb2"}
        />
        <h2 className="result-title">
          {outcome.kind === "정통"
            ? "정통 만두 완성!"
            : outcome.kind === "신메뉴"
              ? "오! 신메뉴로 등재"
              : "손님이 그냥 나갔어요"}
        </h2>
        <p className="result-sub">
          {outcome.kind === "정통"
            ? "할머니 만두 그대로예요. 손님이 한 접시 더 시켰어요."
            : outcome.kind === "신메뉴"
              ? "정통은 아닌데… 이거 팔아도 되겠는데요?"
              : `이 맛이 아니래요. 정통 재료 ${outcome.correctCount}가지는 양까지 맞았어요.`}
        </p>
      </div>

      {outcome.kind === "정통" && (
        <div className="result-card">
          <span className="result-card__label">오늘의 만두속</span>
          <span className="result-card__body">
            {RECIPE_IDS.map((id) => `${ingredientEmoji(id)} ${ingredientName(id)} ×${RECIPE[id]}`).join(" · ")}
          </span>
          <span className="result-card__meta">{look}</span>
        </div>
      )}

      {outcome.kind === "신메뉴" && (
        <div className="result-card result-card--accent">
          <span className="result-card__label">
            {isNewMenu ? "도감에 등록됐어요" : "이미 도감에 있는 신메뉴예요"}
          </span>
          <strong className="result-card__name">
            {outcome.menu.emoji} {outcome.menu.name}
          </strong>
          <span className="result-card__meta">
            {outcome.menu.ingredients.map((id) => `${ingredientEmoji(id)} ${ingredientName(id)}`).join(" · ")}
          </span>
        </div>
      )}

      <div className="spacer" />

      <div className="cta-stack">
        {revealedNow && (
          <div className="reveal">
            <span className="reveal__label">힌트를 얻었어요</span>
            <strong className="reveal__item">
              {ingredientEmoji(revealedNow)} {ingredientName(revealedNow)} ×{RECIPE[revealedNow]}
            </strong>
            <span className="reveal__note">
              정통 만두엔 이만큼 들어가요 · {hints.found}/{hints.total} 알아냄
            </span>
          </div>
        )}
        {!revealedNow && canHint && (
          <button type="button" className="reward-button" disabled={!adReady} onClick={onWatchHintAd}>
            <span className="reward-button__top">
              <span className="reward-button__ad">광고</span>
              <span className="reward-button__label">광고 영상 보고 힌트 얻기</span>
            </span>
            <span className="reward-button__note">
              {adReady ? "영상이 끝나면 재료 하나의 양을 알려줘요" : "광고 준비 중이에요"}
            </span>
          </button>
        )}
      </div>

      <button type="button" className="primary-button" onClick={onReplay}>
        {outcome.kind === "실패" ? "다시 만들기" : "한 판 더"}
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
