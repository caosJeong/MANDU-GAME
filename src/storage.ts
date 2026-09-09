/**
 * 플레이 기록 저장소예요.
 * 앱인토스 정책상 유저 식별자와 플레이 기록(도감 진행도, 알아낸 힌트)은 유지돼야 해요.
 *
 * TODO: 지금은 기기 localStorage에만 저장해요. 서버를 붙일 때
 *       userId를 토스 로그인 식별자로 교체하고 아래 값들을 동기화해야 해요.
 */
import { NEW_MENU_TOTAL, RECIPE_IDS } from "./game/recipe";

const STORAGE_KEY = "mandu.save.v2";

export type SaveData = {
  userId: string;
  /** 만들어 본 신메뉴 id 목록이에요. */
  discovered: string[];
  /** 광고로 알아낸 정통 레시피 재료 id 목록이에요. 한 번 알아내면 계속 남아요. */
  revealed: string[];
  /** 정통 레시피를 한 번이라도 완성했는지예요. */
  clearedRecipe: boolean;
  roundsPlayed: number;
};

function createDefault(): SaveData {
  return {
    userId: `local-${Math.random().toString(36).slice(2, 10)}`,
    discovered: [],
    revealed: [],
    clearedRecipe: false,
    roundsPlayed: 0,
  };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefault();
    return { ...createDefault(), ...(JSON.parse(raw) as Partial<SaveData>) } as SaveData;
  } catch {
    return createDefault();
  }
}

export function saveSave(data: SaveData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 저장 실패(사파리 프라이빗 모드 등)해도 게임 진행은 막지 않아요.
  }
}

export function menuProgress(data: SaveData) {
  return { found: data.discovered.length, total: NEW_MENU_TOTAL };
}

export function hintProgress(data: SaveData) {
  return { found: data.revealed.length, total: RECIPE_IDS.length };
}

/** 아직 안 밝혀진 정통 재료 중 하나를 골라요. 다 밝혀졌으면 null 이에요. */
export function nextHintId(data: SaveData): string | null {
  const left = RECIPE_IDS.filter((id) => !data.revealed.includes(id));
  if (left.length === 0) return null;
  return left[Math.floor(Math.random() * left.length)];
}
