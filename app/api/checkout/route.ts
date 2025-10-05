
import { NextResponse } from "next/server";
import Stripe from "stripe";

const getPriceId = (slug: string) => {
  const envName = `PRICE_ID_${slug.replace(/-/g, "_").toUpperCase()}`;
  return process.env[envName];
};

export async function POST(req: Request) {
  try {
    const { product } = await req.json() as { product?: string };
    if (!product) { return NextResponse.json({ ok: false, error: "Missing product" }, { status: 400 }); }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) { return NextResponse.json({ ok: false, error: "Missing STRIPE_SECRET_KEY" }, { status: 400 }); }

    const priceId = getPriceId(product);
    if (!priceId) { return NextResponse.json({ ok: false, error: `Missing env PRICE_ID for ${product}` }, { status: 400 }); }

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" as any });
    const origin = new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`,
    });
    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: any) { return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 }); }
}
