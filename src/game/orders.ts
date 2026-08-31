/**
 * 손님 주문이에요. 한 판에 3~5개가 랜덤으로 제시돼요 (기획서 2번).
 * 주문 의도를 못 맞춰도 만두는 완성되고 진행이 끊기지 않아요 — 보너스만 못 받아요.
 */
import { INGREDIENT_BY_ID, type Ingredient, type IngredientTag } from "./ingredients";

export type OrderIntent = "spicy" | "hearty" | "light" | "umami" | "sweet";

export type Order = {
  index: number;
  intent: OrderIntent;
  hint: string;
  customer: string;
};

const HINTS: Record<OrderIntent, string[]> = {
  spicy: ["매콤한 거 주세요", "오늘 좀 화끈한 걸로요", "땀 좀 흘리고 싶어요"],
  hearty: ["든든한 거 주세요", "밥 대신 먹을 거예요", "배부른 걸로 부탁해요"],
  light: ["담백한 거 주세요", "속이 편한 걸로요", "느끼한 건 빼주세요"],
  umami: ["감칠맛 나는 거요", "깊은 맛이 좋아요", "국물 없이도 진한 걸로"],
  sweet: ["달달한 거 주세요", "디저트 같은 거 있나요?", "후식으로 먹을 거예요"],
};

const CUSTOMERS = ["🧑", "👵", "🧒", "👨‍🦰", "👩‍🦱", "🧓", "👦", "👧"];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** 한 판에 낼 주문 3~5개를 만들어요. */
export function createOrders(): Order[] {
  const count = 3 + Math.floor(Math.random() * 3);
  const intents: OrderIntent[] = ["spicy", "hearty", "light", "umami", "sweet"];
  return Array.from({ length: count }, (_, index) => {
    const intent = pick(intents);
    return {
      index,
      intent,
      hint: pick(HINTS[intent]),
      customer: pick(CUSTOMERS),
    };
  });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function countTag(items: Ingredient[], tag: IngredientTag): number {
  return items.filter((it) => it.tags.includes(tag)).length;
}

/** 재료 조합이 주문 의도에 맞는지 판정해요. */
export function matchesOrder(intent: OrderIntent, ids: string[]): boolean {
  const items = ids.map((id) => INGREDIENT_BY_ID[id]).filter(Boolean);
  if (items.length === 0) return false;

  switch (intent) {
    case "spicy":
      return countTag(items, "spicy") >= 1;
    case "hearty":
      return countTag(items, "hearty") >= 2 || (countTag(items, "hearty") >= 1 && countTag(items, "meat") >= 1);
    case "light":
      return average(items.map((it) => it.fresh)) >= 6.5 && countTag(items, "spicy") === 0;
    case "umami":
      return average(items.map((it) => it.umami)) >= 6;
    case "sweet":
      return countTag(items, "sweet") >= 2;
  }
}

export function intentLabel(intent: OrderIntent): string {
  return { spicy: "매콤", hearty: "든든", light: "담백", umami: "감칠맛", sweet: "달달" }[intent];
}
