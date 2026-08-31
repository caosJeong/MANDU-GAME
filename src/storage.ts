/**
 * 플레이 기록 저장소예요.
 * 앱인토스 정책상 유저 식별자와 플레이 기록(도감 진행도, 포인트, 주간 기록)은 유지돼야 해요.
 *
 * TODO: 지금은 기기 localStorage에만 저장해요. 서버 랭킹을 붙일 때
 *       userId를 토스 로그인 식별자로 교체하고 아래 값들을 서버와 동기화해야 해요.
 */
import { HIDDEN_TOTAL } from "./game/recipes";

const STORAGE_KEY = "mandu.save.v1";

export type SaveData = {
  userId: string;
  points: number;
  /** 발견한 히든 레시피 id 목록 */
  discovered: string[];
  roundsPlayed: number;
  weekly: {
    weekKey: string;
    hiddenFound: number;
    rounds: number;
    bestScore: number;
  };
};

/** ISO 주차 기준 주 키예요 (예: 2026-W35). 주간 랭킹 집계 단위로 써요. */
export function currentWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function createDefault(): SaveData {
  return {
    userId: `local-${Math.random().toString(36).slice(2, 10)}`,
    points: 0,
    discovered: [],
    roundsPlayed: 0,
    weekly: { weekKey: currentWeekKey(), hiddenFound: 0, rounds: 0, bestScore: 0 },
  };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefault();
    const parsed = { ...createDefault(), ...(JSON.parse(raw) as Partial<SaveData>) } as SaveData;
    // 주가 바뀌었으면 주간 집계만 초기화해요 (도감/포인트는 유지).
    if (parsed.weekly?.weekKey !== currentWeekKey()) {
      parsed.weekly = { weekKey: currentWeekKey(), hiddenFound: 0, rounds: 0, bestScore: 0 };
    }
    return parsed;
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

export function discoveredProgress(data: SaveData) {
  return { found: data.discovered.length, total: HIDDEN_TOTAL };
}
