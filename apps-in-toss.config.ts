import { defineConfig } from "@apps-in-toss/web-framework/config";

// 콘솔 등록 완료 — workspaceId 61095(doran) / miniAppId 71595.
// 표시 이름/아이콘/스크린샷은 콘솔의 "앱 정보" 화면에서 등록해요.
export default defineConfig({
  appName: "mandu-game",
  brand: {
    primaryColor: "#B068CC",
  },
  // 토스 내비게이션 바의 뒤로가기·홈을 끕니다.
  // 화면 이동은 앱 안의 버튼(돌아가기 / 🏠 홈)이 담당해요 — 내비바 버튼은 우리 SPA 의
  // 화면 전환을 모르기 때문에 눌러도 타이틀로 돌아오지 못하고 앱이 닫혀요.
  // 둘 다 두면 같은 기능이 두 번 보여서 검수에서 반려됩니다(2026-09-09 반려 사유).
  // 닫기(✕)와 더보기(⋯)는 내비바에 그대로 남아요.
  navigationBar: {
    withBackButton: false,
    withHomeButton: false,
  },
  webView: {},
  permissions: [],
  webBundleDir: "dist",
});
