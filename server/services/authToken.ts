import dayjs from 'dayjs';
import { sign, verify } from 'hono/jwt';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import type { Context } from 'hono';
import { Employee } from 'server/db/models/Employee';
import JsonEmployee from '~/JsonModels/JsonEmployee';
import hashIds from './hashId';

const {
  ENVIRONMENT = 'development',
} = process.env;

// Token 配置
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 分鐘
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 天

// Token 類型定義
interface AccessTokenPayload {
  employee: JsonEmployee;
  type: 'access';
  iat: number;
  exp: number;
  [key: string]: any;
}

interface RefreshTokenPayload {
  employeeId: string;
  type: 'refresh';
  iat: number;
  exp: number;
  [key: string]: any;
}


/**
 * 設置 access token 和 refresh token cookies
 */
export const setEmployeeTokens = async (c: Context, employee: Employee) => {
  const employeeData = employee.toJSON();
  
  // 生成 access token
  const accessToken = await sign(
    {
      employee: employeeData,
      type: 'access',
      iat: dayjs().unix(),
      exp: dayjs().add(ACCESS_TOKEN_EXPIRY, 'seconds').unix(),
    } as AccessTokenPayload,
    process.env.JWT_SECRET,
  );

  // 生成 refresh token
  const refreshToken = await sign(
    {
      employeeId: employeeData.hashId,
      type: 'refresh',
      iat: dayjs().unix(),
      exp: dayjs().add(REFRESH_TOKEN_EXPIRY, 'seconds').unix(),
    } as RefreshTokenPayload,
    process.env.JWT_SECRET,
  );


  // 設置 cookies
  setCookie(c, 'access-token', accessToken, {
    secure: ENVIRONMENT === 'production',
    httpOnly: ENVIRONMENT === 'production',
    maxAge: ACCESS_TOKEN_EXPIRY,
    sameSite: 'Lax',
  });

  setCookie(c, 'refresh-token', refreshToken, {
    secure: ENVIRONMENT === 'production',
    httpOnly: ENVIRONMENT === 'production',
    maxAge: REFRESH_TOKEN_EXPIRY,
    sameSite: 'Lax',
  });
};

/**
 * 移除所有 token cookies
 */
export const removeEmployeeTokens = (c: Context) => {
  deleteCookie(c, 'access-token');
  deleteCookie(c, 'refresh-token');
};

/**
 * 驗證 access token，如果無效則自動嘗試使用 refresh token 刷新
 */
export const verifyAccessToken = async (c: Context): Promise<JsonEmployee | null> => {
  const token = getCookie(c, 'access-token');
  try {
    if (!token) {
      // 如果沒有 access token，嘗試使用 refresh token 刷新
      throw new Error('access token not found');
    }
    const decoded = await verify(token, process.env.JWT_SECRET) as unknown as AccessTokenPayload;
    if (decoded.type !== 'access') {
      // 如果 access token 類型不正確，嘗試使用 refresh token 刷新
      throw new Error('Invalid access token type');
    }
    return new JsonEmployee().load(decoded.employee);
  } catch {
    // 如果 access token 驗證失敗，嘗試使用 refresh token 刷新
    return await refreshAccessToken(c);
  }
};

/**
 * 內部函數：驗證 refresh token 並返回新的 access token
 */
const refreshAccessToken = async (c: Context): Promise<JsonEmployee | null> => {
  const refreshToken = getCookie(c, 'refresh-token');
  if (!refreshToken) {
    return null;
  }

  try {
    const decoded = await verify(refreshToken, process.env.JWT_SECRET) as unknown as RefreshTokenPayload;
    if (decoded.type !== 'refresh') {
      return null;
    }

    // JWT 的 exp 欄位會自動處理過期檢查
    // 查找員工資料
    const employee = await Employee.findOne({ 
      where: { id: hashIds.decode(decoded.employeeId) } as any,
    });
    
    if (
      !employee
      || !employee.isActive
      || employee?.passwordUpdatedAt && dayjs(employee.passwordUpdatedAt).isAfter(dayjs.unix(decoded.iat))
    ) {
      c.set('force-logout', true);
      return null;
    }
    
    // 生成新的 access token
    const newAccessToken = await sign(
      {
        employee: employee.toJSON(),
        type: 'access',
        iat: dayjs().unix(),
        exp: dayjs().add(ACCESS_TOKEN_EXPIRY, 'seconds').unix(),
      } as AccessTokenPayload,
      process.env.JWT_SECRET,
    );

    // 設置新的 access token cookie
    setCookie(c, 'access-token', newAccessToken, {
      secure: ENVIRONMENT === 'production',
      httpOnly: ENVIRONMENT === 'production',
      maxAge: ACCESS_TOKEN_EXPIRY,
      sameSite: 'Lax',
    });

    return new JsonEmployee().load(employee.toJSON());
  } catch {
    return null;
  }
};

/**
 * 撤銷 refresh token
 * 由於不使用快取，只需要清除 cookie
 */
export const revokeRefreshToken = async (c: Context) => {
  // 直接清除 refresh token cookie
  deleteCookie(c, 'refresh-token');
};
