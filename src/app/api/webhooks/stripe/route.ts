import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import Stripe from "stripe";

// Initiate Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const body = await request.json();
    const sig = request.headers.get("stripe-signature");
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
    } catch (error) {
      return NextResponse.error();
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        // Here we will connect to the database to update credits.
        // 'payment_intent.succeeded' confirms money has been transfered
        const { db } = await connectToDatabase();
        // TODO: add DB call to update credits.

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}

// Notes
// So we have two tables in DB. we find data associated between a post and profile by assigning uid value from auth0. That way when querying you can get the right data for the specific user from different places.
