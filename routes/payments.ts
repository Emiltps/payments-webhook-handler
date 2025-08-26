import { Router } from "express";
import { postPaymentWebhook } from "../controllers/paymentsController";

const router = Router();

router.post("/webhooks/payments", postPaymentWebhook);

export default router;
