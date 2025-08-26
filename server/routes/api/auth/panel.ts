import { Hono } from 'hono';
import { Employee } from 'server/db/models/Employee';
import { removeEmployeeTokenInfoCookie, wrapEmployeeTokenInfoCookie } from 'server/services/authToken';
import { compare } from 'server/services/bcrypt';
import RequestError, { StatusCodes } from '~/shared/RequestError';

const authPanelRoute = new Hono();

authPanelRoute.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  const employee = await Employee.findOne({ where: { email } });
  if (!employee) {
    throw new RequestError({
      errorMessage: 'login-failed',
      status: StatusCodes.BAD_REQUEST,
    });
  }
  const isPasswordValid = await compare(password, employee.password);
  if (!isPasswordValid) {
    throw new RequestError({
      errorMessage: 'login-failed',
      status: StatusCodes.BAD_REQUEST,
    });
  }
  await wrapEmployeeTokenInfoCookie(c, employee);
  return c.json({ message: 'success' }, StatusCodes.OK);
});

authPanelRoute.get('/logout', async (c) => {
  await removeEmployeeTokenInfoCookie(c);
  return c.redirect('/panel/login');
});

export default authPanelRoute;