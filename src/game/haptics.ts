/**
 * 앱인토스 Device.triggerHaptic 래퍼예요.
 * - 토스 앱(WebView) 안에서는 실제 기기 진동을 일으켜요.
 * - 일반 브라우저(로컬 개발)에서는 navigator.vibrate로 폴백해요.
 * - 둘 다 없으면 조용히 무시해요.
 */
import { Device } from "@apps-in-toss/web-framework";

export type HapticType =
  | "tickWeak"
  | "tap"
  | "tickMedium"
  | "softMedium"
  | "basicWeak"
  | "basicMedium"
  | "success"
  | "error"
  | "wiggle"
  | "confetti";

const FALLBACK_PATTERN: Record<HapticType, number | number[]> = {
  tickWeak: 8,
  tap: 10,
  tickMedium: 15,
  softMedium: 25,
  basicWeak: 20,
  basicMedium: 30,
  success: [10, 30, 10],
  error: 60,
  wiggle: 15,
  confetti: [10, 20, 10, 20, 10],
};

let lastCallAt = 0;
const MIN_INTERVAL_MS = 40; // 너무 잦은 호출로 버벅이지 않게 스로틀

function vibrateFallback(type: HapticType) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(FALLBACK_PATTERN[type]);
  } catch {
    // no-op
  }
}

export function triggerHaptic(type: HapticType) {
  const now = performance.now();
  if (now - lastCallAt < MIN_INTERVAL_MS) return;
  lastCallAt = now;

  try {
    // 브릿지가 없는 환경에서는 이 호출 자체가 동기적으로 예외를 던져요.
    Device.triggerHaptic({ type }).catch(() => vibrateFallback(type));
  } catch {
    vibrateFallback(type);
  }
}
