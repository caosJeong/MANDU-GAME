/**
 * 정통 레시피 한 개 + 신메뉴 목록이에요.
 *
 * 판정 순서:
 *   1) 정통 — 재료 종류와 "수량"까지 정확히 일치해야 해요 (원작의 무조건 실패 규칙)
 *   2) 신메뉴 — 정해둔 조합과 재료 종류만 일치하면 돼요 (수량은 안 봐요)
 *   3) 그 외는 실패
 */
import { ingredientName } from "./ingredients";

/** 넣은 재료를 { 재료id: 개수 } 로 세어 둔 값이에요. */
export type Filling = Record<string, number>;

/**
 * 정통 레시피예요.
 *
 * 실제 해태 고향만두 표시 원재료의 함량 내림차순 순서를 12번의 선택으로 환산했어요.
 * 공개된 함량 수치는 돼지고기 13% 하나뿐이라 나머지는 표시 순서 기준이에요.
 * TODO: 제품 패키지 원재료명을 확인해 실제 배합비에 맞게 조정할 것.
 */
export const RECIPE: Filling = {
  pork: 3,
  tofu: 2,
  onion: 2,
  chive: 2,
  leek: 1,
  garlic: 1,
  noodle: 1,
};

export const RECIPE_IDS = Object.keys(RECIPE);
export const RECIPE_TOTAL = Object.values(RECIPE).reduce((a, b) => a + b, 0);

export type NewMenu = {
  id: string;
  name: string;
  emoji: string;
  /** 이 재료들만 들어가면 돼요. 개수는 안 봐요. */
  ingredients: string[];
  /** 도감에서 아직 못 만든 신메뉴에 보여줄 힌트예요. */
  hint: string;
};

export const NEW_MENUS: NewMenu[] = [
  {
    id: "spicy_cheese",
    name: "매콤치즈 만두",
    emoji: "🧀",
    ingredients: ["cheese", "gochujang", "pepper"],
    hint: "매운 것을 치즈로 덮으면",
  },
  {
    id: "egg_mayo",
    name: "에그마요 만두",
    emoji: "🥚",
    ingredients: ["egg", "mayo"],
    hint: "분식집 소스 두 가지",
  },
  {
    id: "dessert",
    name: "디저트 만두",
    emoji: "🍫",
    ingredients: ["choco", "jelly"],
    hint: "달기만 한 두 가지",
  },
  {
    id: "vegan",
    name: "담백 채식 만두",
    emoji: "🌱",
    ingredients: ["tofu", "leek", "noodle"],
    hint: "고기 없이 담백하게",
  },
  {
    id: "fire",
    name: "불맛 만두",
    emoji: "🔥",
    ingredients: ["pork", "pepper", "gochujang"],
    hint: "매운 것에 고기를 더하면",
  },
  {
    id: "yikes",
    name: "고양이도 놀란 만두",
    emoji: "😹",
    ingredients: ["choco", "mayo"],
    hint: "고양이도 인상을 찌푸린 조합",
  },
];

export const NEW_MENU_TOTAL = NEW_MENUS.length;

export type Outcome =
  | { kind: "정통" }
  | { kind: "신메뉴"; menu: NewMenu }
  | { kind: "실패"; correctCount: number };

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sorted = [...a].sort();
  return [...b].sort().every((id, i) => id === sorted[i]);
}

/** 정통과 정확히 일치하는 재료 "개수"를 세요 (실패 화면 힌트용이에요). */
function countMatching(filling: Filling): number {
  return RECIPE_IDS.filter((id) => (filling[id] ?? 0) === RECIPE[id]).length;
}

export function judge(filling: Filling): Outcome {
  const picked = Object.keys(filling).filter((id) => filling[id] > 0);

  const isRecipe =
    picked.length === RECIPE_IDS.length &&
    RECIPE_IDS.every((id) => filling[id] === RECIPE[id]);
  if (isRecipe) return { kind: "정통" };

  const menu = NEW_MENUS.find((m) => sameSet(m.ingredients, picked));
  if (menu) return { kind: "신메뉴", menu };

  return { kind: "실패", correctCount: countMatching(filling) };
}

/** 도감·결과 화면에 쓸 "돼지고기 ×3 · 두부 ×2 …" 문자열이에요. */
export function recipeLine(): string {
  return RECIPE_IDS.map((id) => `${ingredientName(id)} ×${RECIPE[id]}`).join(" · ");
}

export function newMenuLine(menu: NewMenu): string {
  return menu.ingredients.map(ingredientName).join(" · ");
}
