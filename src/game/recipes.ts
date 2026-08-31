/**
 * 히든 레시피예요. 기획서 3.3대로 확률이 아니라 "재료 조합 정확 매칭"으로만 등장해요.
 * (유저가 커뮤니티에 조합법을 공유하도록 유도하는 게 목적이에요.)
 *
 * TODO: 기획서 8번 항목 — 출시 시점 히든 개수 확정 필요. 지금은 8개로 시작해요.
 */
import { INGREDIENT_BY_ID } from "./ingredients";

export type HiddenRecipe = {
  id: string;
  name: string;
  emoji: string;
  /** 정확히 이 재료들만 넣어야 발동해요 (순서 무관, 개수도 일치해야 해요). */
  ingredients: string[];
  /** 도감에서 아직 못 찾은 레시피에 보여줄 힌트예요. */
  hint: string;
};

export const HIDDEN_RECIPES: HiddenRecipe[] = [
  {
    id: "dessert",
    name: "디저트 만두",
    emoji: "🍫",
    ingredients: ["choco", "strawberry"],
    hint: "달달한 두 가지",
  },
  {
    id: "buldak",
    name: "불닭 만두",
    emoji: "🔥",
    ingredients: ["kimchi", "cheese", "buldak"],
    hint: "매운 걸 치즈로 덮으면?",
  },
  {
    id: "applepie",
    name: "애플파이 만두",
    emoji: "🥧",
    ingredients: ["apple", "cinnamon"],
    hint: "가을 향이 나는 과일",
  },
  {
    id: "garlic_shrimp",
    name: "갈릭새우 만두",
    emoji: "🧄",
    ingredients: ["shrimp", "cheese", "garlic"],
    hint: "바다 + 진한 것 + 향신료",
  },
  {
    id: "vegan",
    name: "담백 채식 만두",
    emoji: "🌱",
    ingredients: ["mushroom", "cabbage", "tofu"],
    hint: "고기 없이 담백하게",
  },
  {
    id: "king",
    name: "왕만두",
    emoji: "👑",
    ingredients: ["pork", "noodle", "cabbage", "chive"],
    hint: "시장 앞 그 만두, 재료 네 개",
  },
  {
    id: "churros",
    name: "츄러스 만두",
    emoji: "🥨",
    ingredients: ["choco", "cinnamon"],
    hint: "놀이공원에서 파는 그 맛",
  },
  {
    id: "fire_noodle",
    name: "불닭볶음면 만두",
    emoji: "🍜",
    ingredients: ["buldak", "noodle"],
    hint: "면과 매운 소스만",
  },
];

export const HIDDEN_TOTAL = HIDDEN_RECIPES.length;

/** 선택한 재료 조합이 히든 레시피와 정확히 일치하면 그 레시피를 돌려줘요. */
export function matchHiddenRecipe(ids: string[]): HiddenRecipe | null {
  const selected = [...ids].sort().join(",");
  return (
    HIDDEN_RECIPES.find((recipe) => [...recipe.ingredients].sort().join(",") === selected) ?? null
  );
}

/** 도감에 보여줄 재료 이름 문자열이에요. */
export function recipeIngredientNames(recipe: HiddenRecipe): string {
  return recipe.ingredients.map((id) => INGREDIENT_BY_ID[id]?.name ?? id).join(" + ");
}
