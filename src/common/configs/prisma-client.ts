import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  DB_CONNECTION_LIMIT,
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_TIME_ZONE,
  DB_USER,
} from "./keys";
import { PrismaClient } from "../../../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  connectionLimit: DB_CONNECTION_LIMIT,
  timezone: DB_TIME_ZONE,
});

export const prisma = new PrismaClient({
  adapter,
  errorFormat: "pretty",
});
