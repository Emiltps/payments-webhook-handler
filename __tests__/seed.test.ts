import db from "../db/connection";
import seed from "../db/seeds/seed";
import data from "../db/data/test-data/index";

beforeAll(async () => await seed(data));
afterAll(async () => await db.end());

describe("seed testing", () => {
  describe("invoices table", () => {
    test("invoices table exists", async () => {
      const result = await db.query<{ exists: boolean }>(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'invoices'
        );
      `);
      expect(result.rows[0].exists).toBe(true);
    });

    test("invoices table seeded correctly", async () => {
      const result = await db.query(
        "SELECT id, status, total_cents, paid_cents FROM invoices ORDER BY id"
      );
      expect(result.rows.length).toBe(data.invoicesData.length);

      for (let i = 0; i < data.invoicesData.length; i++) {
        const expected = data.invoicesData[i];
        const actual = result.rows[i];
        expect(actual.id).toBe(expected.id);
        expect(actual.status).toBe(expected.status);
        expect(actual.total_cents).toBe(expected.total_cents);
        expect(actual.paid_cents).toBe(expected.paid_cents);
      }
    });
  });
  describe("payment_events table", () => {
    test("payment_events table exists", async () => {
      const result = await db.query<{ exists: boolean }>(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'payment_events'
        );
      `);
      expect(result.rows[0].exists).toBe(true);
    });
  });
});
