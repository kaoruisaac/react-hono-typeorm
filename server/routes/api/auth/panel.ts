import { Hono } from 'hono';
import { Employee } from 'server/db/models/Employee';
import { setEmployeeTokens, removeEmployeeTokens, revokeRefreshToken } from 'server/services/authToken';
import { compare } from 'server/services/bcrypt';
import RequestError, { StatusCodes } from '~/shared/RequestError';

const authPanelRoute = new Hono();

/**
 * 員工登入端點
 * 驗證帳號密碼後設置 access token 和 refresh token
 */
authPanelRoute.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  
  // 查找員工
  const employee = await Employee.findOne({ where: { email } });
  if (!employee) {
    throw new RequestError({
      errorMessage: 'login-failed',
      status: StatusCodes.BAD_REQUEST,
    });
  }
  
  // 檢查員工是否啟用
  if (!employee.isActive) {
    throw new RequestError({
      errorMessage: 'account-disabled',
      status: StatusCodes.BAD_REQUEST,
    });
  }
  
  // 驗證密碼
  const isPasswordValid = await compare(password, employee.password);
  if (!isPasswordValid) {
    throw new RequestError({
      errorMessage: 'login-failed',
      status: StatusCodes.BAD_REQUEST,
    });
  }
  
  // 設置 tokens
  await setEmployeeTokens(c, employee);
  
  return c.json({ 
    message: 'login-success',
    employee: employee.toJSON(),
  }, StatusCodes.OK);
});

/**
 * 員工登出端點
 * 撤銷 refresh token 並清除所有 cookies
 */
authPanelRoute.get('/logout', async (c) => {
  // 撤銷 refresh token
  await revokeRefreshToken(c);
  
  // 移除所有 token cookies
  removeEmployeeTokens(c);
  
  return c.redirect('/panel/login');
});

export default authPanelRoute;