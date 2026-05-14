import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  DB_CONNECT_TIMEOUT,
  DB_CONNECTON_LIMIT,
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_POOL_TIMEOUT,
  DB_PORT,
  DB_TIME_ZONE,
  DB_USER,
} from './keys';
import { PrismaClient } from '../../../generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  timezone: DB_TIME_ZONE,
  connectionLimit: DB_CONNECTON_LIMIT,
  acquireTimeout: DB_POOL_TIMEOUT,
  connectTimeout: DB_CONNECT_TIMEOUT,
});

export const prisma = new PrismaClient({
  adapter,
  errorFormat: 'pretty',
});
