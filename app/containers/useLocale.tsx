import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { LANGUAGES } from '~/constants';
import { useServerContext } from './serverContext';

const useLocale = () => {
  const { i18n } = useTranslation();
  const { locale } = useServerContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const changeLocale = useCallback((locale: string) => {
    navigate(`/${locale}${location.pathname.replace(/^\/(en|tw)/, '')}`);
    i18n.changeLanguage(LANGUAGES[locale]);
  }, [i18n, location, navigate]);

  const getLocalePath = useCallback((path: string) => {
    return `/${locale}${path}`;
  }, [locale]);

  const localeNavigate = useCallback((path: string) => {
    navigate(getLocalePath(path));
  }, [getLocalePath, navigate]);

  return {
    changeLocale,
    getLocalePath,
    localeNavigate,
  };
};

export default useLocale;