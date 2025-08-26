import request from "supertest";
import { app } from "../app";
import seed from "../db/seeds/seed";
import db from "../db/connection";
import data from "../db/data/test-data/index";

beforeAll(async () => await seed(data));
afterAll(async () => await db.end());

describe("POST /webhooks/payments", () => {
  test("200: marks invoices partially paid", async () => {
    const result = await request(app).post("/webhooks/payments").send({
      event_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      type: "payment",
      invoice_id: "11111111-1111-1111-1111-111111111111",
      amount_cents: 5000,
    });

    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);

    const { rows } = await db.query(
      "SELECT status, paid_cents FROM invoices WHERE id = $1",
      ["11111111-1111-1111-1111-111111111111"]
    );
    expect(rows[0].status).toBe("partially_paid");
    expect(rows[0].paid_cents).toBe(5000);
  });
});
