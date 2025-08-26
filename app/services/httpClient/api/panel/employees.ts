import axios from '../../axios';

const route = '/panel/employees';

export const createEmployee = (data: { name: string, email: string, roles: string[], isActive: boolean }) => {
  return axios.post(route, data);
};

export const updateEmployee = (hashId: string, data: { name: string, email: string, roles: string[], isActive: boolean }) => {
  return axios.put(`${route}/${hashId}`, data);
};