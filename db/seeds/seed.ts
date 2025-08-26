import db from "../connection";
import format from "pg-format";

import { PaymentEvent, Invoice } from "../../types/payment";

type SeedData = {
  invoicesData: Invoice[];
  paymentEventsData: PaymentEvent[];
};

const seed = async ({ invoicesData }: SeedData) => {
  if (process.env.NODE_ENV !== "production") {
    await db.query(`CREATE SCHEMA IF NOT EXISTS billing;`);
  }

  await db.query(`DROP TABLE IF EXISTS payment_events`);
  await db.query(`DROP TABLE IF EXISTS invoices`);

  await db.query(`
    CREATE TABLE invoices (
      id UUID PRIMARY KEY,
      status TEXT NOT NULL CHECK (status IN ('sent','partially_paid','paid')),
      total_cents INT NOT NULL CHECK (total_cents > 0),
      paid_cents INT NOT NULL DEFAULT 0
    )
  `);
  await db.query(`
    CREATE TABLE payment_events (
      event_id UUID PRIMARY KEY,
      type TEXT NOT NULL CHECK (type = 'payment'),
      invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      amount_cents INT NOT NULL CHECK (amount_cents > 0),
      created_at TIMESTAMP DEFAULT NOW()
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
