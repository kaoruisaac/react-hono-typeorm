import { type LoaderFunction, redirect } from 'react-router';
import PanelLayout from './PanelLayout';
import queryString from 'query-string';

const LANGUAGES = {
  'tw': 'zh-TW',
  'en': 'en-US',
};

export const loader: LoaderFunction = async ({ context, params }) => {
  const { locale } = params;
  const { employee, forceLogout } = context;
  if (!employee) {
    throw redirect(`/panel/login?${queryString.stringify({ expired: forceLogout ? true : undefined })}`);
  }
  const language = LANGUAGES[locale];
  if (!language) {
    throw redirect('/panel/en');
  }
  
  // 返回員工資料，確保 loader 有返回值
  return { employee, language };
};

export default PanelLayout;
