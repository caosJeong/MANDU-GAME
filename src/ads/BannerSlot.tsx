import { useRef } from "react";
import { useTossBanner } from "../hooks/useTossBanner";
import { isBannerAllowedOn, isPlaceholderAdGroupId, AD_GROUP_IDS, type ScreenId } from "./policy";

/**
 * 화면 하단 고정 배너 슬롯이에요 (기획서 4.2).
 * - 배너 금지 화면(타이틀/로딩/팝업)에서는 아예 렌더하지 않아요.
 * - 슬롯 높이를 항상 확보해서 조작 UI 위로 배너가 덮이지 않게 해요.
 */
export function BannerSlot({ screen }: { screen: ScreenId }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const allowed = isBannerAllowedOn(screen);
  const { isAttached } = useTossBanner(slotRef, allowed);

  if (!allowed) return null;

  return (
    <div className="banner-slot" aria-label="광고 영역">
      <div ref={slotRef} className="banner-slot__inner" />
      {!isAttached && (
        <span className="banner-slot__placeholder">
          {isPlaceholderAdGroupId(AD_GROUP_IDS.banner)
            ? "배너 영역 (광고 그룹 ID 발급 전)"
            : "광고 불러오는 중"}
        </span>
      )}
    </div>
  );
}
