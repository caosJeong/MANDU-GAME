/**
 * 재료 풀과 맛 속성치예요.
 * 기획서 3.1에 따라 재료는 짠맛/감칠맛/신선도를 갖고, "궁합"은 재료 쌍 사이의
 * 상성 점수(AFFINITY)로 따로 표현해요.
 */

export type IngredientTag =
  | "meat"
  | "veggie"
  | "seafood"
  | "hearty"
  | "spicy"
  | "sweet"
  | "light";

export type Ingredient = {
  id: string;
  name: string;
  emoji: string;
  /** 짠맛 0~10 */
  salty: number;
  /** 감칠맛 0~10 */
  umami: number;
  /** 신선도 0~10 */
  fresh: number;
  tags: IngredientTag[];
};

export const INGREDIENTS: Ingredient[] = [
  { id: "pork", name: "돼지고기", emoji: "🥩", salty: 4, umami: 9, fresh: 3, tags: ["meat", "hearty"] },
  { id: "chive", name: "부추", emoji: "🌿", salty: 1, umami: 3, fresh: 9, tags: ["veggie", "light"] },
  { id: "shrimp", name: "새우", emoji: "🍤", salty: 5, umami: 8, fresh: 8, tags: ["seafood"] },
  { id: "kimchi", name: "김치", emoji: "🥬", salty: 7, umami: 7, fresh: 5, tags: ["veggie", "spicy"] },
  { id: "noodle", name: "당면", emoji: "🍜", salty: 1, umami: 2, fresh: 2, tags: ["hearty"] },
  { id: "cheese", name: "치즈", emoji: "🧀", salty: 8, umami: 8, fresh: 2, tags: ["hearty"] },
  { id: "mushroom", name: "버섯", emoji: "🍄", salty: 2, umami: 8, fresh: 6, tags: ["veggie"] },
  { id: "garlic", name: "마늘", emoji: "🧄", salty: 1, umami: 6, fresh: 7, tags: ["veggie"] },
  { id: "cabbage", name: "양배추", emoji: "🥬", salty: 1, umami: 2, fresh: 9, tags: ["veggie", "light"] },
  { id: "tofu", name: "두부", emoji: "🫓", salty: 1, umami: 4, fresh: 7, tags: ["light"] },
  { id: "buldak", name: "불닭소스", emoji: "🌶️", salty: 8, umami: 6, fresh: 1, tags: ["spicy"] },
  { id: "choco", name: "초코", emoji: "🍫", salty: 1, umami: 2, fresh: 1, tags: ["sweet"] },
  { id: "strawberry", name: "딸기", emoji: "🍓", salty: 0, umami: 1, fresh: 10, tags: ["sweet", "light"] },
  { id: "apple", name: "사과", emoji: "🍎", salty: 0, umami: 1, fresh: 10, tags: ["sweet", "light"] },
  { id: "cinnamon", name: "계피", emoji: "🍂", salty: 1, umami: 3, fresh: 2, tags: ["sweet"] },
];

export const INGREDIENT_BY_ID: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((it) => [it.id, it]),
);

/**
 * 재료 쌍의 궁합 점수예요. +는 잘 어울리는 조합, -는 상극이에요.
 * 표에 없는 쌍은 0(무난)으로 봐요.
 */
const AFFINITY: Record<string, number> = {
  // 국룰 조합
  "chive|pork": 4,
  "garlic|pork": 3,
  "chive|garlic": 2,
  "noodle|pork": 3,
  "cabbage|pork": 2,
  "kimchi|pork": 4,
  "kimchi|tofu": 3,
  "mushroom|pork": 3,
  "chive|shrimp": 3,
  "garlic|shrimp": 3,
  "cheese|kimchi": 3,
  "buldak|cheese": 3,
  // 디저트 계열끼리는 잘 어울려요
  "choco|strawberry": 4,
  "apple|cinnamon": 4,
  "choco|cinnamon": 2,
  // 상극
  "choco|kimchi": -5,
  "choco|shrimp": -5,
  "choco|pork": -4,
  "buldak|strawberry": -5,
  "cheese|strawberry": -3,
  "apple|shrimp": -3,
  "cinnamon|kimchi": -4,
  "buldak|apple": -4,
};

function pairKey(a: string, b: string) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** 두 재료의 궁합 점수를 돌려줘요. 표에 없으면 0이에요. */
export function affinityOf(a: string, b: string): number {
  return AFFINITY[pairKey(a, b)] ?? 0;
}

/** 선택한 재료 전체 조합의 궁합 합계예요. */
export function totalAffinity(ids: string[]): number {
  let sum = 0;
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      sum += affinityOf(ids[i], ids[j]);
    }
  }
  return sum;
}
