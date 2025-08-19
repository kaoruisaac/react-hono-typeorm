import { EMPLOYEE_ROLE } from '~/shared/roles';
import * as yup from 'yup';

export const create = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  roles: yup.array().of(yup.string().oneOf(Object.values(EMPLOYEE_ROLE))).required(),
  password: yup.string().required(),
});
