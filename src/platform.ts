/**
 * 토스 앱(WebView) 환경 관련 유틸이에요.
 * 앱인토스 정책상 "모든 화면에서 미니앱 나가기 경로 확보"가 필요해서
 * 헤더의 나가기 버튼이 이 함수를 써요.
 */
import { SafeArea, Screen, User } from "@apps-in-toss/web-framework";
import { useEffect, useState } from "react";
import { hasAppsInTossBridge } from "./ads/bridge";

/** 미니앱을 닫아요. 브릿지가 없는 로컬 브라우저에서는 아무 일도 하지 않아요. */
export async function closeMiniApp(): Promise<boolean> {
  if (!hasAppsInTossBridge()) return false;
  try {
    await Screen.close();
    return true;
  } catch {
    return false;
  }
}

export type Insets = { top: number; bottom: number; left: number; right: number };

const ZERO_INSETS: Insets = { top: 0, bottom: 0, left: 0, right: 0 };

/** Safe Area inset을 구독해요. 로컬 브라우저에서는 0으로 두고 CSS env()가 대신 처리해요. */
export function useSafeAreaInsets(): Insets {
  const [insets, setInsets] = useState<Insets>(ZERO_INSETS);

  useEffect(() => {
    if (!hasAppsInTossBridge()) return;
    try {
      setInsets({ ...ZERO_INSETS, ...SafeArea.get() });
      return SafeArea.subscribe({ onEvent: (next) => setInsets({ ...ZERO_INSETS, ...next }) });
    } catch {
      return;
    }
  }, []);

  return insets;
}

/**
 * 유저 식별자예요. 토스 앱 안에서는 익명 키를 쓰고, 실패하면 로컬 id를 그대로 써요.
 * (정책: 유저 식별자 저장 및 플레이 기록 유지 필수)
 */
export async function resolveUserId(fallback: string): Promise<string> {
  if (!hasAppsInTossBridge()) return fallback;
  try {
    if (!User.getAnonymousKey.isSupported()) return fallback;
    const result = await User.getAnonymousKey();
    return result?.type === "HASH" && result.hash ? `toss-${result.hash}` : fallback;
  } catch {
    return fallback;
  }
}
