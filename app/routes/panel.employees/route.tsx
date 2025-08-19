import { type LoaderFunction } from "react-router";
import EmployeesSearchPage, { type SearchParams } from "./EmployeesSearchPage";
import { searchParamsLoader } from "server/services/loaders";
import { Employee } from "server/db/models/Employee";
import type { EMPLOYEE_ROLE } from "~/shared/roles";
import { In, Like } from "typeorm";

export const loader: LoaderFunction = async (req) => {
  const { data, pagination, query } = await searchParamsLoader<Employee, SearchParams>(req, (query, pagination) => {
    return Employee.findAndCount({
      where: {
        name: Like(`%${query.name}%`),
        email: Like(`%${query.email}%`),
        roles: query.roles ? In([query.roles as EMPLOYEE_ROLE]) : undefined,
      },
      ...pagination,
    });
  });
  return { data, pagination, query };
}

export default EmployeesSearchPage;
