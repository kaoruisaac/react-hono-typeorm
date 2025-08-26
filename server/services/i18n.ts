import i18next from 'i18next';
import FsBackend from 'i18next-fs-backend';
import { serverI18nMap } from '~/services/serverI18nMap';

i18next
  .use(FsBackend)
  .init({
    fallbackLng: 'en-US',
    supportedLngs: ['en-US', 'zh-TW'],
    load: 'all',
    lng: 'en-US', // 預設語言
    initImmediate: true,
    backend: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
    },
  });
serverI18nMap.set('en-US', i18next.cloneInstance({ lng: 'en-US' }));
serverI18nMap.set('zh-TW', i18next.cloneInstance({ lng: 'zh-TW' }));

export default i18next;