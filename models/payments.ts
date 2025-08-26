import db from "../db/connection";
import { PaymentEvent } from "../types/payment";

export async function handlePaymentEvent(event: PaymentEvent) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO payment_events (event_id, type, invoice_id, amount_cents)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (event_id) DO NOTHING
       RETURNING *`,
      [event.event_id, event.type, event.invoice_id, event.amount_cents]
    );

    const invoiceResult = await client.query(
      "SELECT total_cents, paid_cents, status FROM invoices WHERE id=$1 FOR UPDATE",
      [event.invoice_id]
    );
    if (invoiceResult.rowCount === 0) {
      throw new Error("Invoice not found");
    }

    const invoice = invoiceResult.rows[0];
    const newPaid = invoice.paid_cents + event.amount_cents;

    let newStatus = invoice.status;
    if (newPaid >= invoice.total_cents) {
      newStatus = "paid";
    } else if (newPaid > 0) {
      newStatus = "partially_paid";
    }

    await client.query(
      "UPDATE invoices SET paid_cents=$1, status=$2 WHERE id=$3",
      [newPaid, newStatus, event.invoice_id]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
