/**
 * 만두속 재료 14종이에요.
 *
 * 원작 고향만두 게임과 같은 구성(정답 7 + 오답 7)을 따르되, 정답 재료와 수량은
 * 실제 해태 고향만두의 표시 원재료를 기준으로 잡았어요. 오답 재료 중 브랜드 자산
 * (에이스·옹스짱)은 초콜릿·젤리로 바꿨어요.
 */

export type Ingredient = {
  id: string;
  name: string;
  emoji: string;
};

/** 화면에 뿌리는 순서예요. 정답과 오답을 섞어 둬야 답이 눈에 안 띄어요. */
export const INGREDIENTS: Ingredient[] = [
  { id: "pork", name: "돼지고기", emoji: "🥩" },
  { id: "egg", name: "계란", emoji: "🥚" },
  { id: "tofu", name: "두부", emoji: "🫓" },
  { id: "choco", name: "초콜릿", emoji: "🍫" },
  { id: "onion", name: "양파", emoji: "🧅" },
  { id: "pepper", name: "매운고추", emoji: "🌶️" },
  { id: "chive", name: "부추", emoji: "🌿" },
  { id: "cheese", name: "치즈", emoji: "🧀" },
  { id: "leek", name: "대파", emoji: "🥬" },
  { id: "gochujang", name: "고추장", emoji: "🥫" },
  { id: "garlic", name: "마늘", emoji: "🧄" },
  { id: "mayo", name: "마요네즈", emoji: "🥄" },
  { id: "noodle", name: "당면", emoji: "🍜" },
  { id: "jelly", name: "젤리", emoji: "🍬" },
];

export const INGREDIENT_BY_ID: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((it) => [it.id, it]),
);

export function ingredientName(id: string): string {
  return INGREDIENT_BY_ID[id]?.name ?? id;
}

export function ingredientEmoji(id: string): string {
  return INGREDIENT_BY_ID[id]?.emoji ?? "❓";
}
