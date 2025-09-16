import Axios from 'axios';
import i18next, { t } from 'i18next';
import NotifyPopUp, { NOTIFY_TYPE } from '~/components/NotifyPopUp/NotifyPopUp';
import { getPopUpController } from '~/containers/PopUp/PopUpProvider';

const axios = Axios.create({
  baseURL: '/api',
  headers: {
    language: i18next.language,
  },
});

axios.interceptors.response.use(
  res  => res,
  async err => {
    if (err.status === 401) {
      const popUpController = getPopUpController();
      const popup = await popUpController.PopUpBox(NotifyPopUp, { message: t('credential-expired-please-login-again'), type: NOTIFY_TYPE.INFO });
      popup.onClose(() => {
        window.location.href = '/panel/login';
      });
      return Promise.reject();
    } else {
      return Promise.reject(err?.response?.data);
    }
  },
);

export default axios;