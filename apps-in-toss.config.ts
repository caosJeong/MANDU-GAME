import { defineConfig } from "@apps-in-toss/web-framework/config";

// 콘솔 등록 완료 — workspaceId 61095(doran) / miniAppId 71595.
// 표시 이름/아이콘/스크린샷은 콘솔의 "앱 정보" 화면에서 등록해요.
export default defineConfig({
  appName: "mandu-game",
  brand: {
    primaryColor: "#B068CC",
  },
  webView: {},
  permissions: [],
  webBundleDir: "dist",
});
