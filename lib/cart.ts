/**
 * CART STATE — browser-local, deliberately.
 *
 * The cart holds PRODUCT IDS AND QUANTITIES. No prices, no names, no totals.
 *
 * That is not a simplification, it is the security model. Everything the cart
 * stores is attacker-controlled — it lives in the visitor's own localStorage —
 * so storing a price would create a number the server might be tempted to
 * trust. `createOrder` reads every figure from the database, and the cart has
 * nothing to tamper with because it carries nothing worth tampering with.
 *
 * Display names and prices are looked up fresh on the cart page, which also
 * means a price change is reflected immediately rather than being frozen at the
 * moment something was added.
 *
 * NO PII IS STORED HERE. The name, phone and town are typed at checkout and go
 * straight to the server. Nothing personal is left in localStorage afterwards.
 */

export const CART_KEY = 'nebsam_cart_v1';

export interface CartLine {
  productId: string;
  quantity: number;
}

/** Reading never throws: private mode, cleared storage and corrupt JSON all mean "empty cart". */
export function readCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((l) =>
      l &&
      typeof l === 'object' &&
      typeof (l as CartLine).productId === 'string' &&
      Number.isInteger((l as CartLine).quantity) &&
      (l as CartLine).quantity > 0
        ? [{ productId: (l as CartLine).productId, quantity: Math.min((l as CartLine).quantity, 99) }]
        : [],
    );
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
    // Same-tab listeners. The `storage` event only fires in OTHER tabs, so the
    // header count would not update in the tab that made the change.
    window.dispatchEvent(new CustomEvent('nebsam:cart'));
  } catch {
    // Storage full or blocked. The cart is a convenience, not a record — the
    // order is what matters, and it lives on the server.
  }
}

export function addToCart(productId: string, quantity = 1): void {
  const lines = readCart();
  const existing = lines.find((l) => l.productId === productId);
  if (existing) existing.quantity = Math.min(existing.quantity + quantity, 99);
  else lines.push({ productId, quantity });
  writeCart(lines);
}

export function setQuantity(productId: string, quantity: number): void {
  const lines = readCart().flatMap((l) =>
    l.productId === productId ? (quantity > 0 ? [{ ...l, quantity: Math.min(quantity, 99) }] : []) : [l],
  );
  writeCart(lines);
}

export function clearCart(): void {
  writeCart([]);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.quantity, 0);
}
