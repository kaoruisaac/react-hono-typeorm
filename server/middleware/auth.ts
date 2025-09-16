import type { Context } from 'hono';
import { verifyAccessToken } from 'server/services/authToken';
import RequestError, { StatusCodes } from '~/shared/RequestError';

/**
 * 認證中介軟體
 * 1. 驗證 access token，如果無效則自動嘗試使用 refresh token 刷新
 * 2. 如果都失敗，則返回 401 錯誤
 */
const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  // 驗證 access token，內部會自動處理 refresh token 刷新
  const employee = await verifyAccessToken(c);
  // 將員工資訊設置到 context 中
  c.set('employee', employee);
  
  return next();
};

export const validateEmployee = async (c: Context, next: () => Promise<void>) => {
  const employee = c.get('employee');
  if (!employee) throw new RequestError({ status: StatusCodes.UNAUTHORIZED, errorMessage: 'Unauthorized' });
  return next();
};

export default authMiddleware;