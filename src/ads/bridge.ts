/**
 * 앱인토스 WebView 브릿지(`window.__appsInTossConstants`)가 없는 환경(일반 브라우저)에서는
 * SDK의 `isSupported()`가 내부적으로 예외를 던져요. 로컬 개발 중에도 앱이 죽지 않도록
 * 브릿지 유무를 먼저 확인한 뒤에만 SDK 함수를 호출하는 안전 래퍼예요.
 */
export function hasAppsInTossBridge(): boolean {
  return (
    typeof window !== "undefined" &&
    (window as { __appsInTossConstants?: unknown }).__appsInTossConstants != null
  );
}

export function safeIsSupported(check: () => boolean): boolean {
  if (!hasAppsInTossBridge()) return false;
  try {
    return check();
  } catch {
    return false;
  }
}
