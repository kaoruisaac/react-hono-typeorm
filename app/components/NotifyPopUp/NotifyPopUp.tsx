import PopUpWindow from "~/components/PopUpWindow";
import { forwardPopup } from "~/containers/PopUp/PopUpProvider";
import { Styled } from 'remix-component-css-loader';
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/react";


const NotifyPopUp = forwardPopup(({ message }, popup) => {
    const { t } = useTranslation();
    return (
    <Styled>
        <PopUpWindow PopUp={popup} header={t('notify')}>
            <section>
                {message}
            </section>
            <footer>
                <Button onClick={popup.close}>{t('close')}</Button>
            </footer>
        </PopUpWindow>
    </Styled>
    )
});

export default NotifyPopUp;