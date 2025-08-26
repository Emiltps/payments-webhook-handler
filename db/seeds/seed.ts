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
      id UUID PRIMARY KEY,
      status TEXT NOT NULL CHECK (status IN ('sent','partially_paid','paid')),
      total_cents INT NOT NULL CHECK (total_cents > 0),
      paid_cents INT NOT NULL DEFAULT 0
    )
  `);
  if (invoicesData.length > 0) {
    const invoiceInsertQuery = format(
      `INSERT INTO invoices (id, status, total_cents, paid_cents) VALUES %L RETURNING *;`,
      invoicesData.map(({ id, status, total_cents, paid_cents }) => [
        id,
        status,
        total_cents,
        paid_cents ?? 0,
      ])
    );
    await db.query(invoiceInsertQuery);
  }
};

export default seed;
