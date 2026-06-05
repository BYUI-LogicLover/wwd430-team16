import { query } from "@/lib/db";

// Example query — visit http://localhost:3000/api/db-check
//
// Demonstrates the `query()` helper from lib/db.ts: a plain SELECT plus a
// parameterized query (note the `$1` placeholder and the values array — always
// pass user input this way, never via string concatenation).
export async function GET() {
  try {
    const info = await query<{ db: string; usr: string; now: Date }>(
      "select current_database() as db, current_user as usr, now() as now",
    );

    const tables = await query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = $1 order by table_name",
      ["public"],
    );

    return Response.json({
      ok: true,
      connection: info.rows[0],
      tables: tables.rows.map((r) => r.table_name),
    });
  } catch (err) {
    console.error("[db-check] query failed:", err);
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
