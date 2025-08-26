export type InvoiceStatus = "sent" | "partially_paid" | "paid";

export interface Invoice {
  id: string;
  status: InvoiceStatus;
  total_cents: number;
  paid_cents?: number;
}

export interface PaymentEvent {
  event_id: string;
  type: "payment";
  invoice_id: string;
  amount_cents: number;
  created_at?: Date;
}
