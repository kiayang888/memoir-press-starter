
import { NextResponse } from "next/server";
type SubscribeBody = { email?: string };
function parseRegionFromMailchimpKey(key: string) { const parts = key.split("-"); return parts.length > 1 ? parts[1] : ""; }

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubscribeBody;
    const email = (body.email || "").trim().toLowerCase();
    if (!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false) { return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 }); }

    const MC_KEY = process.env.MAILCHIMP_API_KEY;
    const MC_LIST = process.env.MAILCHIMP_LIST_ID;
    if (MC_KEY && MC_LIST) {
      const region = parseRegionFromMailchimpKey(MC_KEY);
      const url = `https://${region}.api.mailchimp.com/3.0/lists/${MC_LIST}/members`;
      const payload = { email_address: email, status: "subscribed" };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `apiKey ${MC_KEY}` }, body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.text(); return NextResponse.json({ ok: false, provider: "mailchimp", error: err || res.statusText }, { status: 400 }); }
      return NextResponse.json({ ok: true, provider: "mailchimp" });
    }

    const CK_KEY = process.env.CONVERTKIT_API_KEY;
    const CK_FORM = process.env.CONVERTKIT_FORM_ID;
    if (CK_KEY && CK_FORM) {
      const url = `https://api.convertkit.com/v3/forms/${CK_FORM}/subscribe`;
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ api_key: CK_KEY, email }) });
      const data = await res.json();
      if (!res.ok || data?.error) { return NextResponse.json({ ok: false, provider: "convertkit", error: data?.error || res.statusText }, { status: 400 }); }
      return NextResponse.json({ ok: true, provider: "convertkit" });
    }

    console.log("[subscribe] demo add:", email);
    return NextResponse.json({ ok: true, provider: "demo" });
  } catch (e: any) { return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 }); }
}
