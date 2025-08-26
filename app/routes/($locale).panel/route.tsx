import { type LoaderFunction, redirect } from 'react-router';
import PanelLayout from './PanelLayout';

const LANGUAGES = {
  'tw': 'zh-TW',
  'en': 'en-US',
};

export const loader: LoaderFunction = async ({ context, params }) => {
  const { locale } = params;
  const { employee } = context;
  if (!employee) {
    throw redirect('/panel/login');
  }
  const language = LANGUAGES[locale];
  if (!language) {
    throw redirect('/panel/en');
  }
  
  // 返回員工資料，確保 loader 有返回值
  return { employee, language };
};

export default PanelLayout;
