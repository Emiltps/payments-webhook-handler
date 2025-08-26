import { Invoice } from "../../../types/payment";

export const invoicesData: Invoice[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    status: "sent",
    total_cents: 10000,
    paid_cents: 0,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    status: "sent",
    total_cents: 20000,
    paid_cents: 0,
  },
];

export default invoicesData;
