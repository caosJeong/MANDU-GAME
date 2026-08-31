import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";
import { useCallback, useEffect, useRef, useState } from "react";
import { AD_GROUP_IDS, validateAdPlacement } from "../ads/policy";
import { safeIsSupported } from "../ads/bridge";

type LoadState = "idle" | "loading" | "loaded" | "showing" | "unsupported" | "error";

/**
 * 보상형 광고의 load -> show -> 다음 load 순서를 관리해요.
 * 기획서 4.1대로 사전 로딩을 먼저 해두고, show는 항상 사용자가 버튼을 누른 시점에만 호출해요.
 */
export function useRewardedAd() {
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const cleanupLoadRef = useRef<(() => void) | null>(null);
  const cleanupShowRef = useRef<(() => void) | null>(null);
  const earnedRef = useRef(false);

  const isSupported = safeIsSupported(
    () => loadFullScreenAd.isSupported() && showFullScreenAd.isSupported(),
  );

  const loadAd = useCallback(() => {
    if (!isSupported) {
      setLoadState("unsupported");
      return;
    }
    cleanupLoadRef.current?.();
    setLoadState("loading");
    cleanupLoadRef.current = loadFullScreenAd({
      options: { adGroupId: AD_GROUP_IDS.rewarded },
      onEvent: (event) => {
        if (event.type === "loaded") setLoadState("loaded");
      },
      onError: () => setLoadState("error"),
    });
  }, [isSupported]);

  /**
   * 광고를 재생해요. 사용자가 버튼을 눌렀을 때만 호출해 주세요.
   * onFinished(earned)는 광고가 닫힌 뒤 한 번 호출되고, earned가 true일 때만 보상을 주세요.
   */
  const showAd = useCallback(
    (label: string, onFinished: (earned: boolean) => void) => {
      const violations = validateAdPlacement({
        format: "rewarded",
        label,
        isUserInitiated: true,
        isBlockingCriticalFlow: false,
        isIntroOrLoading: false,
        isNearPrimaryAction: false,
        hasClearAdLabel: true,
        givesRewardForClick: false,
        sameFormatCountOnScreen: 1,
      });
      if (violations.length > 0 || loadState !== "loaded") {
        onFinished(false);
        return;
      }

      cleanupShowRef.current?.();
      setLoadState("showing");
      earnedRef.current = false;

      cleanupShowRef.current = showFullScreenAd({
        options: { adGroupId: AD_GROUP_IDS.rewarded },
        onEvent: (event) => {
          switch (event.type) {
            case "userEarnedReward":
              // 보상은 반드시 이 이벤트에서만 확정해요 (클릭/닫기 시점 X).
              earnedRef.current = true;
              break;
            case "failedToShow":
              setLoadState("error");
              onFinished(false);
              break;
            case "dismissed":
              setLoadState("idle");
              onFinished(earnedRef.current);
              loadAd();
              break;
          }
        },
        onError: () => {
          setLoadState("error");
          onFinished(false);
        },
      });
    },
    [loadAd, loadState],
  );

  useEffect(() => {
    loadAd();
    return () => {
      cleanupLoadRef.current?.();
      cleanupShowRef.current?.();
    };
  }, [loadAd]);

  return { isSupported, isLoaded: loadState === "loaded", loadState, showAd };
}
