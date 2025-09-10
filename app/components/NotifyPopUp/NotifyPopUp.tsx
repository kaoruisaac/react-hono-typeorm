import PopUpWindow from '~/components/PopUpWindow';
import { forwardPopup } from '~/containers/PopUp/PopUpProvider';
import { Styled } from 'remix-component-css-loader';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/GridSystem/heroui';

export enum NOTIFY_TYPE {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
}


const NotifyPopUp = forwardPopup(({ message, type = NOTIFY_TYPE.INFO }: { message: string, type?: NOTIFY_TYPE }, popup) => {
  const { t } = useTranslation();
  return (
    <Styled className={type}>
      <PopUpWindow PopUp={popup} header={t('notify')}>
        <section>
          {message}
        </section>
        <footer>
          <Button onPress={popup.close}>{t('close')}</Button>
        </footer>
      </PopUpWindow>
    </Styled>
  );
});

export default NotifyPopUp;