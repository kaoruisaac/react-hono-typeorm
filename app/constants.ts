import { EMPLOYEE_ROLE } from '~/shared/roles';

export enum PAGE_MODE {
  MODE_CREATE,
  MODE_EDIT,
  MODE_VIEW,
}
export const ROLE_OPTIONS = [
  { label: 'admin', value: EMPLOYEE_ROLE.ADMIN },
  { label: 'manager', value: EMPLOYEE_ROLE.MANAGER },
  { label: 'user', value: EMPLOYEE_ROLE.USER },
];

export const LANGUAGES = {
  'tw': 'zh-TW',
  'en': 'en-US',
};
