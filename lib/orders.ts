import { pool } from "@/lib/db";

export type OrderItem = {
  id: string;
  productId: string | null;
  title: string;
  priceCents: number;
  quantity: number;
};

export type Order = {
  id: string;
  status: string;
  totalCents: number;
  fullName: string;
  street: string;
  city: string;
  zip: string;
  createdAt: Date;
  items: OrderItem[];
};

export type ShippingInput = {
  fullName: string;
  street: string;
  city: string;
  zip: string;
};

/** What the cart submits: a product and how many of it. Price is NOT trusted. */
export type CartLine = {
  productId: string;
  quantity: number;
};

/**
 * Create an order for a user from cart lines. Prices and titles are read from
 * the products table (never trusted from the client) and snapshotted onto the
 * order. Runs in a transaction so the order and its items commit together.
 * Returns the new order id, or null if none of the lines map to a real product.
 */
export async function createOrder(
  userId: string,
  shipping: ShippingInput,
  lines: CartLine[],
): Promise<string | null> {
  const wanted = new Map<string, number>();
  for (const line of lines) {
    if (!line.productId || !Number.isInteger(line.quantity) || line.quantity < 1) continue;
    wanted.set(line.productId, (wanted.get(line.productId) ?? 0) + line.quantity);
  }
  if (wanted.size === 0) return null;

  const client = await pool.connect();
  try {
    await client.query("begin");

    const priced = await client.query<{ id: string; title: string; priceCents: number }>(
      `select id, title, "priceCents" from public.products where id = any($1)`,
      [[...wanted.keys()]],
    );
    if (priced.rows.length === 0) {
      await client.query("rollback");
      return null;
    }

    const totalCents = priced.rows.reduce(
      (sum, p) => sum + p.priceCents * (wanted.get(p.id) ?? 0),
      0,
    );

    const orderResult = await client.query<{ id: string }>(
      `insert into public.orders
         ("userId", "totalCents", "fullName", street, city, zip)
       values ($1, $2, $3, $4, $5, $6)
       returning id`,
      [userId, totalCents, shipping.fullName, shipping.street, shipping.city, shipping.zip],
    );
    const orderId = orderResult.rows[0].id;

    for (const p of priced.rows) {
      await client.query(
        `insert into public.order_items
           ("orderId", "productId", title, "priceCents", quantity)
         values ($1, $2, $3, $4, $5)`,
        [orderId, p.id, p.title, p.priceCents, wanted.get(p.id)],
      );
    }

    await client.query("commit");
    return orderId;
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

/** All orders for a user, newest first, each with its line items. */
export async function listOrdersForUser(userId: string): Promise<Order[]> {
  const result = await pool.query<Order>(
    `select
        o.id, o.status, o."totalCents", o."fullName", o.street, o.city, o.zip, o."createdAt",
        coalesce(
          json_agg(
            json_build_object(
              'id', i.id,
              'productId', i."productId",
              'title', i.title,
              'priceCents', i."priceCents",
              'quantity', i.quantity
            ) order by i.title
          ) filter (where i.id is not null),
          '[]'
        ) as items
      from public.orders o
      left join public.order_items i on i."orderId" = o.id
      where o."userId" = $1
      group by o.id
      order by o."createdAt" desc`,
    [userId],
  );
  return result.rows;
}
