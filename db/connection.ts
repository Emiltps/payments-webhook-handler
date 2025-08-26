import { Pool } from "pg";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({ path: `${__dirname}/../.env.${ENV}` });
console.log("PGDATABASE:", process.env.PGDATABASE);

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE must be set");
} else {
  console.log(`Connecting to database: ${process.env.PGDATABASE} (${ENV})`);
}

const db = new Pool();
export default db;
