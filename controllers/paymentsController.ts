import { Request, Response } from "express";
import { handlePaymentEvent } from "../models/payments";
import { PaymentEvent } from "../types/payment";

export async function postPaymentWebhook(req: Request, res: Response) {
  try {
    await handlePaymentEvent(req.body);
    res.status(200).json({ ok: true });
  } catch (err: any) {
    if (err.message === "Invoice not found") {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error processing payment event", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
