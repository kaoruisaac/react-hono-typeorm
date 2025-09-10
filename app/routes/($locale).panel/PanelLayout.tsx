import { useTranslation } from 'react-i18next';
import { Outlet, Link, useLocation } from 'react-router';
import { Styled } from 'remix-component-css-loader';
import { useServerContext } from '~/containers/serverContext';
import useLocale from '~/containers/useLocale';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from '~/components/GridSystem/heroui';
import { RiGlobalLine, RiLogoutCircleLine } from '@remixicon/react';
import './PanelLayout.css';

const PanelLayout = () => {
  const { t } = useTranslation();
  const { employee } = useServerContext();
  const location = useLocation();
  const { changeLocale, getLocalePath } = useLocale();

  const navigationItems = [
    { name: t('home'), href: '/panel', icon: '🏠' },
    { name: t('employees'), href: '/panel/employees', icon: '👥' },
  ];


  return (
    <Styled>
      <div className="panel-layout">
        <aside className="panel-sidebar">
          <div className="panel-header">
            <div className="flex justify-between items-center">
              <h1 className="panel-title">{t('panel-title')}</h1>
              <Dropdown
                placement="bottom-end"
              >
                <DropdownTrigger>
                  <span>
                    <RiGlobalLine size={20} />
                  </span>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(e) => {
                    changeLocale(e.toString());
                  }}
                >
                  <DropdownItem key="tw">
                    繁體中文
                  </DropdownItem>
                  <DropdownItem key="en">
                    English
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <p className="panel-subtitle">{`Hi ${employee?.name}`}</p>
          </div>

          <nav className="panel-nav">
            <div className="panel-nav-list">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={getLocalePath(item.href)}
                  className={`panel-nav-item ${location.pathname === item.href ? 'active' : ''}`}
                >
                  <span className="panel-nav-icon">{item.icon}</span>
                  <span className="panel-nav-text">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="panel-user-info">
            <div className="panel-user-container">
              <div className="panel-user-avatar">
                <span className="panel-user-avatar-text">{employee?.name?.charAt(0) || '-'}</span>
              </div>
              <div className="panel-user-details">
                <p className="panel-user-name">{employee?.name || '---'}</p>
                <p className="panel-user-role">{employee?.roles || '---'}</p>
              </div>
              <a
                href="/api/auth/panel/logout"
                className="panel-logout-btn"
              >
                <Tooltip content={t('logout')} placement="left">
                  <RiLogoutCircleLine size={24} />
                </Tooltip>
              </a>
            </div>
          </div>
        </aside>

        {/* 主要內容區域 */}
        <main className="panel-main">
          <Outlet />
        </main>
      </div>
    </Styled>
  );
};

export default PanelLayout;