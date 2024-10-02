// dbqueries.mjs
import pg from "pg";
import NodeCache from "node-cache";
import "dotenv/config";

const { Pool } = pg;
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function searchRampByWarehouse(warehouseNumber) {
  const cachedRampNumber = cache.get(warehouseNumber);
  if (cachedRampNumber) {
    return cachedRampNumber;
  }

  const client = await pool.connect();
  try {
    const query = {
      text: `
        SELECT ramp_number
        FROM ramp_warehouse
        WHERE $1 = ANY(warehouse_numbers);
      `,
      values: [warehouseNumber],
    };
    const result = await client.query(query);
    const rampNumber =
      result.rows.length > 0 ? result.rows[0].ramp_number : null;

    if (rampNumber) {
      cache.set(warehouseNumber, rampNumber);
    }

    return rampNumber;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  } finally {
    client.release();
  }
}
