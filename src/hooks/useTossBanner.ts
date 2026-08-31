import { TossAds } from "@apps-in-toss/web-framework";
import { useEffect, useRef, useState } from "react";
import { AD_GROUP_IDS } from "../ads/policy";
import { safeIsSupported } from "../ads/bridge";

type BannerStatus = "idle" | "initializing" | "ready" | "attached" | "unsupported" | "error";

let sharedInitializePromise: Promise<void> | null = null;

function initializeOnce() {
  if (sharedInitializePromise != null) return sharedInitializePromise;
  sharedInitializePromise = new Promise<void>((resolve, reject) => {
    TossAds.initialize({
      callbacks: {
        onInitialized: () => resolve(),
        onInitializationFailed: (error) => reject(error),
      },
    });
  });
  return sharedInitializePromise;
}

/**
 * 슬롯 엘리먼트에 배너를 부착해요.
 * 화면이 바뀌면 슬롯도 사라지므로 언마운트 시 배너를 정리해요
 * (배너 금지 화면 — 타이틀/로딩/팝업 — 으로 넘어갈 때 잔상이 남지 않게 하기 위해서예요).
 */
export function useTossBanner(slotRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [status, setStatus] = useState<BannerStatus>("idle");
  const attachedRef = useRef(false);
  const isSupported = safeIsSupported(
    () => TossAds.initialize.isSupported() && TossAds.attachBanner.isSupported(),
  );

  useEffect(() => {
    if (!enabled) return;
    if (!isSupported) {
      setStatus("unsupported");
      return;
    }
    let cancelled = false;
    setStatus("initializing");
    initializeOnce()
      .then(() => {
        if (cancelled) return;
        const el = slotRef.current;
        if (!el) {
          setStatus("ready");
          return;
        }
        TossAds.attachBanner(AD_GROUP_IDS.banner, el);
        attachedRef.current = true;
        setStatus("attached");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      if (attachedRef.current && safeIsSupported(() => TossAds.destroyAll.isSupported())) {
        TossAds.destroyAll();
        attachedRef.current = false;
      }
    };
  }, [enabled, isSupported, slotRef]);

  return { status, isSupported, isAttached: status === "attached" };
}
