// import { createPool } from "mysql2/promise";// conjunto de conexiones usando promesas
// import { Pool } from "pg"; // npm i pg // postgresql
import pkg from "pg" // npm i pg // postgresql
const { Pool } = pkg
// const { Pool } = require("pg")
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "./config.js";

console.log("DB_DATABASE db.js", DB_DATABASE)

/* export const pool = createPool({ // mysql
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE,
}); */

// postgresql
export const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})