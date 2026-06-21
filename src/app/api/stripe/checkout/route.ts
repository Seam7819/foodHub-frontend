import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY in environment variables." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = await request.json();
    const { deliveryAddress, items } = body as {
      deliveryAddress: string;
      items: Array<{ id: string; name: string; price: number; quantity: number; image?: string }>;
    };

    if (!deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Delivery address and cart items are required." },
        { status: 400 }
      );
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          metadata: {
            mealId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${appUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/stripe/cancel`,
      metadata: {
        deliveryAddress,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout session creation failed", error);
    return NextResponse.json(
      { error: error?.message || "Unable to create Stripe checkout session." },
      { status: 500 }
    );
  }
}
