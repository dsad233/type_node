import "dotenv/config";
import { Algorithm } from "jsonwebtoken";

export const DB_HOST = String(process.env.DB_HOST) || "localhost";
export const DB_USER = String(process.env.DB_USER);
export const DB_PASS = String(process.env.DB_PASS);
export const DB_PORT = Number(process.env.DB_PORT) || 3306;
export const DB_NAME = String(process.env.DB_NAME);
export const DB_POOl = Number(process.env.DB_POOl);
export const DB_CONNECTION_LIMIT = Number(process.env.DB_CONNECTION_LIMIT);
export const DB_TIME_ZONE = String(process.env.DB_TIME_ZONE) || "Asia/Seoul";

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

export const JWT_REFRESH_ALGORITHM = String(process.env.JWT_REFRESH_ALGORITHM);
export const JWT_REFRESH_SECRET_KEY = String(
  process.env.JWT_REFRESH_SECRET_KEY,
);
export const JWT_REFRESH_EXPIRES = String(process.env.JWT_REFRESH_EXPIRES);

/**
 * Redis
 */
export const REDIS_HOST = process.env.REDIS_HOST || "localhost";
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_PASS = process.env.REDIS_PASS || "";
export const REDIS_DB = Number(process.env.REDIS_DB) || 0;
