import axios from '../../axios';

const route = '/panel/employees';

export const createEmployee = (data: { name: string, email: string, roles: string[], isActive: boolean, password: string }) => {
  return axios.post(route, data);
};

export const updateEmployee = (hashId: string, data: { name: string, email: string, roles: string[], isActive: boolean, password?: string }) => {
  return axios.put(`${route}/${hashId}`, data);
};