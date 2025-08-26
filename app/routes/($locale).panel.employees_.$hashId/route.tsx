import type { LoaderFunction } from 'react-router';
import EmployeesDetailPage from './EmployeesDetailPage';
import { Employee } from 'server/db/models/Employee';
import { detailPageLoader } from 'server/services/loaders';
import { PAGE_MODE } from '~/constants';

export const loader: LoaderFunction = async (req) => {
  const { id, mode } = detailPageLoader(req);
  if (mode === PAGE_MODE.MODE_CREATE) {
    return { mode };
  }
  const employee = await Employee.findOne({ where: { id } });
  return { mode, employee: employee?.toJSON() };
};

export default EmployeesDetailPage;