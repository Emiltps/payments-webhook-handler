import db from "../connection";
import format from "pg-format";

import { PaymentEvent, Invoice } from "../../types/payment";

const seed = async ({ invoicesData }: { invoicesData: Invoice[] }) => {
  if (process.env.NODE_ENV !== "production") {
    await db.query(`CREATE SCHEMA IF NOT EXISTS billing;`);
  }

  await db.query(`DROP TABLE IF EXISTS invoices`);

  await db.query(`
    CREATE TABLE invoices (
    )
  `);
};

export default seed;
