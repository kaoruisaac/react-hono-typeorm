import i18next from "i18next";
import path from "path";

// 動態導入 FsBackend 以避免 top-level await 問題
const initI18n = async () => {
  const { default: FsBackend } = await import("i18next-fs-backend");
  
  return i18next
    .use(FsBackend)
    .init({
      fallbackLng: 'en-US',
      supportedLngs: ['en-US', 'zh-TW'],
      lng: 'en-US', // 預設語言
      initImmediate: true,
      backend: {
        loadPath: path.join('../public/locales/{{lng}}/{{ns}}.json'),
      },
    });
};

// 初始化 i18n
const i18nInstance = initI18n();

export default i18next;
export { i18nInstance };