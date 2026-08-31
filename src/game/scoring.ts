/**
 * 등급 판정이에요 (기획서 3.2).
 * - 상: 궁합 좋은 조합 + 조리 완성도
 * - 중: 무난한 밸런스형
 * - 하: 궁합이 나쁘거나 몰빵형
 * - 히든: 정해진 조합 정확 매칭 (조리 점수와 무관하게 히든으로 확정)
 */
import { INGREDIENT_BY_ID, totalAffinity, type IngredientTag } from "./ingredients";
import { matchHiddenRecipe, type HiddenRecipe } from "./recipes";
import { matchesOrder, type Order } from "./orders";

export type Grade = "상" | "중" | "하" | "히든";

export type StageScores = {
  /** 만두피 밀기 0~100 */
  dough: number;
  /** 빚기 리듬 0~100 */
  fold: number;
  /** 화력 조절 0~100 */
  cook: number;
};

export type MandiResult = {
  grade: Grade;
  hidden: HiddenRecipe | null;
  orderMatched: boolean;
  /** 0~100 종합 점수 */
  score: number;
  points: number;
  fillingIds: string[];
  /** 결과 화면에 보여줄 한 줄 코멘트예요. */
  comment: string;
};

const POINTS_BY_GRADE: Record<Grade, number> = { 상: 30, 중: 20, 하: 10, 히든: 60 };
const ORDER_BONUS = 15;

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** 몰빵형: 선택한 재료 3개 이상이 전부 같은 태그 하나로 묶이는 경우예요. */
function isOneNote(ids: string[]): boolean {
  if (ids.length < 3) return false;
  const items = ids.map((id) => INGREDIENT_BY_ID[id]).filter(Boolean);
  const tagCounts = new Map<IngredientTag, number>();
  for (const item of items) {
    for (const tag of item.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  return [...tagCounts.values()].some((count) => count === items.length);
}

/** 재료 조합만 놓고 본 점수예요 (0~100). */
export function fillingScore(ids: string[]): number {
  const items = ids.map((id) => INGREDIENT_BY_ID[id]).filter(Boolean);
  if (items.length === 0) return 0;

  let score = 50;
  score += totalAffinity(ids) * 4;

  const salty = average(items.map((it) => it.salty));
  const umami = average(items.map((it) => it.umami));
  const fresh = average(items.map((it) => it.fresh));

  if (salty >= 3 && salty <= 7) score += 8;
  else score -= 6; // 너무 싱겁거나 너무 짜요
  if (umami >= 5) score += 6;
  if (fresh >= 5) score += 6;
  if (isOneNote(ids)) score -= 15;

  return Math.max(0, Math.min(100, score));
}

export function judge(ids: string[], stages: StageScores, order: Order): MandiResult {
  const hidden = matchHiddenRecipe(ids);
  const filling = fillingScore(ids);
  const craft = (stages.dough + stages.fold + stages.cook) / 3;
  const score = Math.round(filling * 0.5 + craft * 0.5);

  let grade: Grade;
  if (hidden) grade = "히든";
  else if (score >= 78) grade = "상";
  else if (score >= 55) grade = "중";
  else grade = "하";

  const orderMatched = matchesOrder(order.intent, ids);
  const points = POINTS_BY_GRADE[grade] + (orderMatched ? ORDER_BONUS : 0);

  return { grade, hidden, orderMatched, score, points, fillingIds: ids, comment: commentFor(grade, stages, orderMatched) };
}

function commentFor(grade: Grade, stages: StageScores, orderMatched: boolean): string {
  if (grade === "히든") return "이런 조합이 있었다니! 도감에 기록됐어요.";
  if (!orderMatched) return "맛은 괜찮은데, 손님이 원하던 맛은 아니었어요.";
  const weakest = Math.min(stages.dough, stages.fold, stages.cook);
  if (weakest === stages.cook && stages.cook < 55) return "조금 탔어요. 화력을 더 빨리 낮춰보세요.";
  if (weakest === stages.dough && stages.dough < 55) return "만두피 두께가 아쉬웠어요.";
  if (weakest === stages.fold && stages.fold < 55) return "접는 타이밍이 조금 엇나갔어요.";
  return grade === "상" ? "완벽해요! 손님이 아주 만족했어요." : "무난하게 잘 만들었어요.";
}
