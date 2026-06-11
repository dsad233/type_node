import 'dotenv/config';

export const NODE_ENV = String(process.env.NODE_ENV) || 'local';
export const TIMEZONE = String(process.env.TIMEZONE) || 'Asia/Seoul';
export const DB_HOST = String(process.env.DB_HOST) || 'localhost';
export const DB_USER = String(process.env.DB_USER);
export const DB_PASS = String(process.env.DB_PASS);
export const DB_PORT = Number(process.env.DB_PORT) || 3306;
export const DB_NAME = String(process.env.DB_NAME);
export const DB_CONNECTON_LIMIT = Number(process.env.DB_CONNECTON_LIMIT);
export const DB_POOL_TIMEOUT = Number(process.env.DB_POOL_TIMEOUT);
export const DB_CONNECT_TIMEOUT = Number(process.env.DB_CONNECT_TIMEOUT);

/**
 * Bcrypt
 */
export const BCYPT_PASSWORD_SALT = Number(process.env.BCYPT_PASSWORD_SALT);

/**
 * Jwt
 */
export const JWT_ACCESS_ALGORITHM = String(process.env.JWT_ACCESS_ALGORITHM);
export const JWT_ACCESS_SECRET_KEY = String(process.env.JWT_ACCESS_SECRET_KEY);
export const JWT_ACCESS_EXPIRES = String(process.env.JWT_ACCESS_EXPIRES);
export const JWT_ACCESS_TTL = Number(process.env.JWT_ACCESS_TTL);

export const JWT_REFRESH_ALGORITHM = String(process.env.JWT_REFRESH_ALGORITHM);
export const JWT_REFRESH_SECRET_KEY = String(
  process.env.JWT_REFRESH_SECRET_KEY,
);
export const JWT_REFRESH_EXPIRES = String(process.env.JWT_REFRESH_EXPIRES);
export const JWT_REFRESH_TTL = Number(process.env.JWT_REFRESH_TTL);

// Guest
export const JWT_GUEST_ACCESS_ALGORITHM = String(
  process.env.JWT_GUEST_ACCESS_ALGORITHM,
);
export const JWT_GUEST_ACCESS_SECRET_KEY = String(
  process.env.JWT_GUEST_ACCESS_SECRET_KEY,
);
export const JWT_GUEST_ACCESS_EXPIRES = String(
  process.env.JWT_GUEST_ACCESS_EXPIRES,
);
export const JWT_GUEST_ACCESS_TTL = Number(process.env.JWT_GUEST_ACCESS_TTL);

/**
 * Redis
 */
export const REDIS_HOST = String(process.env.REDIS_HOST) || 'localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_PASS = String(process.env.REDIS_PASS) || '';
export const REDIS_DB = Number(process.env.REDIS_DB) || 0;

/**
 * NodeMailer
 */
export const MAIL_USER = String(process.env.MAIL_USER);
export const MAIL_PASS = String(process.env.MAIL_PASS);
export const MAILER_HOST = String(process.env.MAILER_HOST);
export const MAILER_PORT = Number(process.env.MAILER_PORT);
