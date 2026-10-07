/**
 * PostgreSQL connection pool (Phase 6).
 * Requires DATABASE_URL in the environment.
 */
import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Copy .env.example to .env.local and configure PostgreSQL."
      );
    }
    pool = new Pool({
      connectionString,
      // Railway / Render / Neon often need SSL in production
      ssl:
        process.env.DATABASE_SSL === "true" || process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" }
          : undefined,
      max: 10,
    });
    pool.on("error", (err) => {
      console.error("Unexpected PostgreSQL pool error", err);
    });
  }
  return pool;
}

/** Parameterised query helper ($1, $2, …) */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params);
}

/** First row or undefined */
export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T | undefined> {
  const res = await query<T>(text, params);
  return res.rows[0];
}

/** All rows */
export async function queryAll<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await query<T>(text, params);
  return res.rows;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
