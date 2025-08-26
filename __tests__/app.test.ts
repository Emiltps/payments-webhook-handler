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
  test("200: marks invoices correctly paid", async () => {
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
    expect(rows[0].status).toBe("paid");
    expect(rows[0].paid_cents).toBe(10000);
  });
  test("400 if invoice does not exist", async () => {
    const result = await request(app).post("/webhooks/payments").send({
      event_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      type: "payment",
      invoice_id: "14111111-1111-1111-1111-141111111111",
      amount_cents: 100,
    });

    expect(result.status).toBe(400);
    expect(result.body.ok).toEqual(false);
    expect(result.body.error).toEqual("Invoice not found");
  });
  test("400 non-positive amount does not exist", async () => {
    const result = await request(app).post("/webhooks/payments").send({
      event_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      type: "payment",
      invoice_id: "11111111-1111-1111-1111-111111111111",
      amount_cents: -100,
    });
    expect(result.status).toBe(400);
    expect(result.body.ok).toEqual(false);
    expect(result.body.error).toEqual("Invalid amount_cents");
  });
  test("400 Invalid body sent", async () => {
    const result = await request(app).post("/webhooks/payments").send("1");
    expect(result.status).toBe(400);
    expect(result.body.ok).toEqual(false);
    expect(result.body.error).toEqual("Invalid body");
  });
  test("400 event id (not UUID)", async () => {
    const result = await request(app).post("/webhooks/payments").send({
      event_id: "bad-id-aaaa-aaaaaaaaaaaa",
      type: "payment",
      invoice_id: "11111111-1111-1111-1111-111111111111",
      amount_cents: 100,
    });
    expect(result.status).toBe(400);
    expect(result.body.ok).toEqual(false);
    expect(result.body.error).toEqual("Invalid event_id");
  });
  test("400 Invalid invoice id (not UUID)", async () => {
    const result = await request(app).post("/webhooks/payments").send({
      event_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      type: "payment",
      invoice_id: "bad-id-1111-1111-111111111111",
      amount_cents: 100,
    });
    expect(result.status).toBe(400);
    expect(result.body.ok).toEqual(false);
    expect(result.body.error).toEqual("Invalid invoice_id");
  });
});
