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
  /** 만두속 그릇에서 다져진 조각으로 보일 색이에요. */
  color: string;
  /** 조각 모양 — 채썬 것(sliver)과 깍둑썬 것(dice)으로 나눠요. */
  cut: "dice" | "sliver";
};

/** 화면에 뿌리는 순서예요. 정답과 오답을 섞어 둬야 답이 눈에 안 띄어요. */
export const INGREDIENTS: Ingredient[] = [
  { id: "pork", name: "돼지고기", emoji: "🥩", color: "#e08585", cut: "dice"  },
  { id: "egg", name: "계란", emoji: "🥚", color: "#f5d66b", cut: "dice"  },
  { id: "tofu", name: "두부", emoji: "🫓", color: "#f7f1de", cut: "dice"  },
  { id: "choco", name: "초콜릿", emoji: "🍫", color: "#7a4a2b", cut: "dice"  },
  { id: "onion", name: "양파", emoji: "🧅", color: "#f0e2c6", cut: "dice"  },
  { id: "pepper", name: "매운고추", emoji: "🌶️", color: "#d53b2a", cut: "sliver"  },
  { id: "chive", name: "부추", emoji: "🌿", color: "#4f9c3f", cut: "sliver"  },
  { id: "cheese", name: "치즈", emoji: "🧀", color: "#f0c04c", cut: "dice"  },
  { id: "leek", name: "대파", emoji: "🥬", color: "#82c05c", cut: "sliver"  },
  { id: "gochujang", name: "고추장", emoji: "🥫", color: "#a62a1c", cut: "dice"  },
  { id: "garlic", name: "마늘", emoji: "🧄", color: "#ede4ce", cut: "dice"  },
  { id: "mayo", name: "마요네즈", emoji: "🥄", color: "#faf3dc", cut: "dice"  },
  { id: "noodle", name: "당면", emoji: "🍜", color: "#dcd5c6", cut: "sliver"  },
  { id: "jelly", name: "젤리", emoji: "🍬", color: "#d96ba8", cut: "dice"  },
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
