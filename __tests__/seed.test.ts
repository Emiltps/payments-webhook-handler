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
  });
});
