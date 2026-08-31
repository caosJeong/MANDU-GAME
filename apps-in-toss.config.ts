import { defineConfig } from "@apps-in-toss/web-framework/config";

// TODO: 콘솔에서 미니앱 등록 후 발급받은 appName 으로 교체해요.
// 표시 이름/아이콘/스크린샷은 콘솔의 "앱 정보" 화면에서 등록해요.
export default defineConfig({
  appName: "mandu-game",
  brand: {
    primaryColor: "#E8894A",
  },
  webView: {},
  permissions: [],
  webBundleDir: "dist",
});
