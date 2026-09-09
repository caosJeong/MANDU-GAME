/**
 * 앱인토스 인앱 광고 정책 가드예요 (기획서 4장).
 * 이 게임의 광고 구조는 **배너(상시) + 보상형(선택)** 이원화예요. 전면(인터스티셜)은 쓰지 않아요.
 * - 결과 화면 진입 자체는 보상형 광고 없이 즉시 노출
 * - 보상형은 사용자가 버튼을 눌렀을 때만 재생
 * - 배너는 조작 영역을 침범하지 않는 고정 영역에만, 인트로/로딩/컷신/팝업에는 노출 금지
 */

export type AdFormat = "rewarded" | "banner";

/** 배너 노출 허용 화면이에요 (기획서 4.2 배치안). */
export type ScreenId = "title" | "play" | "result" | "collection";

const BANNER_ALLOWED_SCREENS: Record<ScreenId, boolean> = {
  title: false, // 첫인상 보호 + 진입 직후 강제 요소 금지
  play: true, // 하단 고정, 조작 영역과 겹치지 않는 높이
  result: true, // 보상형 CTA와 겹치지 않게 배치
  collection: true,
};

export function isBannerAllowedOn(screen: ScreenId): boolean {
  return BANNER_ALLOWED_SCREENS[screen];
}

export type AdPlacement = {
  format: AdFormat;
  label: string;
  /** 사용자가 버튼을 눌러 시작했는지 (보상형에 필수) */
  isUserInitiated: boolean;
  /** 결과 화면 진입 등 필수 플로우를 막고 있는지 */
  isBlockingCriticalFlow: boolean;
  /** 인트로/로딩/컷신/팝업 모달 위인지 */
  isIntroOrLoading: boolean;
  /** 조작 영역/주요 버튼과 겹치는지 */
  isNearPrimaryAction: boolean;
  hasClearAdLabel: boolean;
  /** 클릭 자체로 보상을 주는지 (금지) */
  givesRewardForClick: boolean;
  /** 같은 화면에 있는 동일 포맷 광고 개수 */
  sameFormatCountOnScreen: number;
};

export type PolicyViolation = {
  code:
    | "MISSING_AD_LABEL"
    | "CRITICAL_FLOW_BLOCKED"
    | "INTRO_OR_LOADING"
    | "ACCIDENTAL_CLICK_RISK"
    | "DUPLICATED_FORMAT"
    | "CLICK_REWARD"
    | "NOT_USER_INITIATED";
  message: string;
};

/** 발급 전/미설정 상태를 한눈에 알 수 있게 두는 값이에요. */
const UNSET = "TEST_AD_GROUP_ID_NOT_SET";

/**
 * 광고 지면 ID는 `.env` 에서 읽어요 (공개 저장소에 값을 두지 않으려고요).
 * `.env.example` 을 복사해 콘솔 > 인앱 광고에서 발급받은 값을 채우세요.
 *
 * 주의: Vite 가 빌드 시점에 값을 번들에 심기 때문에, 배포된 앱에서는 여전히
 * 꺼내볼 수 있어요. 저장소에 안 남길 뿐 비밀값이 되는 건 아니에요.
 */
export const AD_GROUP_IDS = {
  rewarded: import.meta.env.VITE_AD_GROUP_REWARDED || UNSET,
  banner: import.meta.env.VITE_AD_GROUP_BANNER || UNSET,
} as const;

export function isPlaceholderAdGroupId(id: string): boolean {
  return id.startsWith("TEST_");
}

export function validateAdPlacement(placement: AdPlacement): PolicyViolation[] {
  const violations: PolicyViolation[] = [];

  if (!placement.hasClearAdLabel) {
    violations.push({
      code: "MISSING_AD_LABEL",
      message: "광고는 콘텐츠처럼 보이면 안 돼요. SDK가 제공하는 Ad 표기를 유지해 주세요.",
    });
  }
  if (placement.isBlockingCriticalFlow) {
    violations.push({
      code: "CRITICAL_FLOW_BLOCKED",
      message: "결과 화면 진입 등 필수 플로우를 광고로 막지 마세요.",
    });
  }
  if (placement.isIntroOrLoading) {
    violations.push({
      code: "INTRO_OR_LOADING",
      message: "인트로/로딩/컷신/팝업 모달에는 광고를 노출할 수 없어요.",
    });
  }
  if (placement.isNearPrimaryAction) {
    violations.push({
      code: "ACCIDENTAL_CLICK_RISK",
      message: "반죽대/재료 선반/화력 게이지 같은 조작 영역 근처에 광고를 두지 마세요.",
    });
  }
  if (placement.sameFormatCountOnScreen > 1) {
    violations.push({
      code: "DUPLICATED_FORMAT",
      message: "같은 화면에 동일 포맷 광고를 2개 이상 배치하지 마세요.",
    });
  }
  if (placement.givesRewardForClick) {
    violations.push({
      code: "CLICK_REWARD",
      message: "클릭 자체를 보상 조건으로 삼지 마세요. userEarnedReward 이벤트에서만 지급해요.",
    });
  }
  if (placement.format === "rewarded" && !placement.isUserInitiated) {
    violations.push({
      code: "NOT_USER_INITIATED",
      message: "보상형 광고는 사용자가 직접 버튼을 눌렀을 때만 재생해요.",
    });
  }

  return violations;
}
