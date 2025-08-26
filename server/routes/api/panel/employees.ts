import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { Employee } from 'server/db/models/Employee';
import hashIds from 'server/services/hashId';

const employeesRoute = new Hono();

// create employee
employeesRoute.post('/', async (c) => {
  const { name, email, roles, isActive } = await c.req.json();
  const employee = await Employee.create({ name, email, roles, isActive });
  return c.json(employee.toJSON());
});

// update employee
employeesRoute.put('/:hashId', async (c) => {
  const { hashId } = c.req.param();
  const { name, email, roles, isActive } = await c.req.json();
  const [employee] = await Employee.findBy({ id: hashIds.decode(hashId) });
  if (!employee) {
    return c.json({ error: 'Employee not found' }, StatusCodes.NOT_FOUND);
  }
  employee.name = name ?? employee.name;
  employee.email = email ?? employee.email;
  employee.roles = roles ?? employee.roles;
  employee.isActive = isActive ?? employee.isActive;
  await employee.save();
  return c.json(employee.toJSON());
});

// delete employee

export default employeesRoute;