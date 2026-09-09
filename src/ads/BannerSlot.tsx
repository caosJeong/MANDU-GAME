import { useRef } from "react";
import { useTossBanner } from "../hooks/useTossBanner";
import { isBannerAllowedOn, isPlaceholderAdGroupId, AD_GROUP_IDS, type ScreenId } from "./policy";

/**
 * 화면 하단 고정 배너 슬롯이에요 (기획서 4.2).
 * - 배너 금지 화면(타이틀/로딩/팝업)에서는 아예 렌더하지 않아요.
 * - 슬롯 높이를 항상 확보해서 조작 UI 위로 배너가 덮이지 않게 해요.
 * - **"광고" 라벨을 눈에 보이게 항상 띄워요.** 예전엔 aria-label 만 있어서 화면상으로는
 *   광고인지 알 수 없었고, 2026-09-09 검수에서 "예상하기 어려운 시점에 광고가 노출된다"로
 *   반려됐어요. 배너가 붙은 뒤에도 라벨은 남습니다.
 */
export function BannerSlot({ screen }: { screen: ScreenId }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const allowed = isBannerAllowedOn(screen);
  const { isAttached } = useTossBanner(slotRef, allowed);

  if (!allowed) return null;

  return (
    <div className="banner-area" aria-label="광고 영역">
      <span className="banner-area__label">광고</span>
      <div className="banner-slot">
        <div ref={slotRef} className="banner-slot__inner" />
        {!isAttached && (
          <span className="banner-slot__placeholder">
            {isPlaceholderAdGroupId(AD_GROUP_IDS.banner)
              ? "배너 영역 (광고 그룹 ID 발급 전)"
              : "광고 불러오는 중"}
          </span>
        )}
      </div>
    </div>
  );
}
