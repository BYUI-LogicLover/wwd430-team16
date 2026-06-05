import { Pool } from "pg";

// Use the pooled Supabase connection (pgBouncer, port 6543) for app queries.
// POSTGRES_URL is populated by the Supabase integration in .env.local.
// For migrations / long-lived sessions use POSTGRES_URL_NON_POOLING instead.
const rawConnectionString = process.env.POSTGRES_URL;

if (!rawConnectionString) {
  throw new Error("POSTGRES_URL is not set. Check your .env.local file.");
}

// Strip `sslmode` from the URL. Newer pg treats `sslmode=require` as full cert
// verification, which the explicit `ssl` option below must govern instead —
// Supabase's pooler presents a cert that won't pass strict verification.
const url = new URL(rawConnectionString);
url.searchParams.delete("sslmode");
const connectionString = url.toString();

// Reuse a single Pool across hot-reloads in dev so we don't exhaust connections.
const globalForDb = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString,
    // Supabase requires TLS; the pooler presents a cert that doesn't chain to a
    // standard CA, so disable strict verification for the connection.
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

/** Run a parameterized SQL query. Always pass values as the second arg. */
export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params);
}
