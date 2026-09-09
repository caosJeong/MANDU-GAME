/**
 * 토스 앱(WebView) 환경 관련 유틸이에요.
 *
 * 나가기/뒤로가기/홈은 토스가 미니앱 위에 그려주는 내비게이션 바가 담당해요.
 * (developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/NavigationBar)
 * 그래서 앱 안에 따로 나가기 버튼을 두지 않아요.
 */
import { SafeArea, User } from "@apps-in-toss/web-framework";
import { useEffect, useState } from "react";
import { hasAppsInTossBridge } from "./ads/bridge";

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
