import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Styled } from "remix-component-css-loader";

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
            {t("pageNotFound") || "頁面未找到"}
          </h1>
          
          <p className="panel-not-found-description">
            {t("pageNotFoundDescription") || "抱歉，您要尋找的頁面不存在或已被移除。"}
          </p>
          
          <div className="panel-not-found-actions">
            <Link 
              to="/panel" 
              className="panel-not-found-button primary"
            >
              <span className="panel-not-found-button-icon">🏠</span>
              {t("backToHome") || "返回首頁"}
            </Link>
            
            <button 
              onClick={handleGoBack} 
              className="panel-not-found-button secondary"
            >
              <span className="panel-not-found-button-icon">⬅️</span>
              {t("goBack") || "返回上一頁"}
            </button>
          </div>
          
          <div className="panel-not-found-help">
            <p className="panel-not-found-help-text">
              {t("needHelp") || "需要協助？"} 
              <Link to="/panel" className="panel-not-found-help-link">
                {t("contactSupport") || "聯絡支援"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default PanelNotFoundPage; 