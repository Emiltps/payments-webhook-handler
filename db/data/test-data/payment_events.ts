import { PaymentEvent } from "../../../types/payment";

export const paymentEventsData: PaymentEvent[] = [
  {
    event_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    type: "payment",
    invoice_id: "11111111-1111-1111-1111-111111111111",
    amount_cents: 5000,
  },
  {
    event_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    type: "payment",
    invoice_id: "22222222-2222-2222-2222-222222222222",
    amount_cents: 7000,
  },
];

export default paymentEventsData;
