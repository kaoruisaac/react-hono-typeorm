import { type LoaderFunction } from 'react-router';
import EmployeesSearchPage, { type SearchParams } from './EmployeesSearchPage';
import { searchParamsLoader } from 'server/services/loaders';
import { Employee } from 'server/db/models/Employee';
import type { EMPLOYEE_ROLE } from '~/shared/roles';
import { Like } from 'typeorm';

export const loader: LoaderFunction = async (req) => {
  const { data, pagination, query } = await searchParamsLoader<Employee, SearchParams>(req, (query, pagination) => {
    return Employee.findAndCount({
      where: {
        name: Like(`%${query.name}%`),
        email: Like(`%${query.email}%`),
        roles: Like(`%${query.roles}%`) as unknown as EMPLOYEE_ROLE, // for sqlite
        isActive: query.isActive ? JSON.parse(query.isActive) : undefined,
      },
      ...pagination,
    });
  });
  return { data, pagination, query };
};

export default EmployeesSearchPage;
