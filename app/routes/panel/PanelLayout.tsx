import { useTranslation } from "react-i18next";
import { Outlet, Link, useLocation } from "react-router";
import { Styled } from "remix-component-css-loader"
import { useServerContext } from "~/containers/serverContext";
import "./PanelLayout.css";

const PanelLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { employee } = useServerContext();

  const navigationItems = [
    { name: t("home"), href: "/panel", icon: "🏠" },
    { name: t("employees"), href: "/panel/employees", icon: "👥" },
  ];

  return (
    <Styled>
      <div className="panel-layout">
        {/* 側邊欄 */}
        <aside className="panel-sidebar">
          {/* 標題區域 */}
          <div className="panel-header">
            <h1 className="panel-title">管理面板</h1>
            <p className="panel-subtitle">歡迎回來</p>
          </div>

          {/* 導航選單 */}
          <nav className="panel-nav">
            <div className="panel-nav-list">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`panel-nav-item ${location.pathname === item.href ? 'active' : ''}`}
                >
                  <span className="panel-nav-icon">{item.icon}</span>
                  <span className="panel-nav-text">{item.name}</span>
                </Link>
              ))}
              {/* 登出按鈕 */}
              <a
                href="/api/auth/panel/logout"
                className="panel-nav-item"
              >
                <span className="panel-nav-icon">🚪</span>
                <span className="panel-nav-text">{t("logout")}</span>
              </a>
            </div>
          </nav>

          {/* 底部用戶資訊 */}
          <div className="panel-user-info">
            <div className="panel-user-container">
              <div className="panel-user-avatar">
                <span className="panel-user-avatar-text">U</span>
              </div>
              <div className="panel-user-details">
                <p className="panel-user-name">{employee?.name || '---'}</p>
                <p className="panel-user-role">{employee?.roles || '---'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* 主要內容區域 */}
        <main className="panel-main">
          <Outlet />
        </main>
      </div>
    </Styled>
  )
}

export default PanelLayout;