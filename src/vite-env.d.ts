/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 보상형(힌트) 광고 지면 ID. 콘솔 > 인앱 광고에서 발급받아 .env 에 넣어요. */
  readonly VITE_AD_GROUP_REWARDED: string;
  /** 배너 광고 지면 ID. */
  readonly VITE_AD_GROUP_BANNER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
