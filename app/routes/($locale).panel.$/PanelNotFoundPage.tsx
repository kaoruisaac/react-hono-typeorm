import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Styled } from 'remix-component-css-loader';

const PanelNotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Styled>
      <div className="panel-not-found">
        <div className="panel-not-found-container">
          <div className="panel-not-found-icon">
            <span className="panel-not-found-emoji">🔍</span>
          </div>
          
          <h1 className="panel-not-found-title">
            {t('page-not-found')}
          </h1>
          
          <p className="panel-not-found-description">
            {t('page-not-found-description')}
          </p>
          
          <div className="panel-not-found-actions">
            <Link 
              to="/panel" 
              className="panel-not-found-button primary"
            >
              <span className="panel-not-found-button-icon">🏠</span>
              {t('back-to-home')}
            </Link>
            
            <button 
              onClick={handleGoBack} 
              className="panel-not-found-button secondary"
            >
              <span className="panel-not-found-button-icon">⬅️</span>
              {t('go-back')}
            </button>
          </div>
          
          <div className="panel-not-found-help">
            <p className="panel-not-found-help-text">
              {t('need-help')} 
              <Link to="/panel" className="panel-not-found-help-link">
                {t('contact-support')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default PanelNotFoundPage; 