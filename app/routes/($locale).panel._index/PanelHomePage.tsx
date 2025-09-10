import { Styled } from 'remix-component-css-loader';
import './PanelHomePage.css';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/GridSystem/heroui';
import { useServerContext } from '~/containers/serverContext';

const PanelHomePage = () => {
  const { t } = useTranslation();
  const { employee } = useServerContext();
  return (
    <Styled>
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">
            {t('panel-welcome-title')}
          </h1>
          <p className="landing-subtitle">
            {`Hi ${employee?.name}`}
          </p>
          <div className="button-group">
            <Button className="primary-button">
              {t('panel-welcome-button')}
            </Button>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default PanelHomePage;