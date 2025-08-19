import { Styled } from "remix-component-css-loader"
import "./PanelHomePage.css"

const PanelHomePage = () => {
  return (
    <Styled>
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">
            歡迎來到管理面板
          </h1>
          <p className="landing-subtitle">
            這是一個簡潔優雅的管理界面，為您提供最佳的用戶體驗
          </p>
          <div className="button-group">
            <button className="primary-button">
              開始使用
            </button>
            <button className="secondary-button">
              了解更多
            </button>
          </div>
        </div>
      </div>
    </Styled>
  )
}

export default PanelHomePage;