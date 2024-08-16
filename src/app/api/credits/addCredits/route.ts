import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import Stripe from "stripe";

// Initiate Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

const withApiAuthRequiredExtended = withApiAuthRequired as any;

export const POST = withApiAuthRequiredExtended(
  async (request: NextRequest, response: NextResponse) => {
    const { db } = await connectToDatabase();
    try {
      const session = await getSession(request, response);
      const user = session?.user;
      if (!user) {
        return NextResponse.error();
      }

      // This is an arry of objects which is used to build out
      // what is being purcased. Kind of hardcoding here, butb works
      // for this example
      const purchasedItems = [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ];

      // Create Stripe session
      // Similar to creating a checkout in BigCommerce
      // const stripeSession = await stripe.checkout.sessions.create({
      //   payment_method_types: ["card"],
      //   line_items: purchasedItems,
      //   mode: "payment",
      //   success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      //   cencel_url: `${process.env.NEXT_PUBLIC_URL}/profile`, // KEY IS WRONG HERE
      //   payment_intent_data: {
      //     metadata: {
      //       urderId: user.sub,
      //     },
      //   },
      //   metadata: {
      //     userId: user.sub,
      //   },
      // });

      // Create Stripe session
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: purchasedItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/profile`,
        payment_intent_data: {
          metadata: {
            uid: user.sub,
          },
        },
        metadata: {
          uid: user.sub,
        },
      });

      // Below is exmaple boilerplate code to juts increate credits
      //   let profile;
      //   const data = await db
      //     .collection("profiles")
      //     .find({
      //       uid: user.sub,
      //     })
      //     .toArray();
      //   if (data.length === 0) {
      //     await db.collection("profiles").insertOne({
      //       uid: user.sub,
      //       credits: 10,
      //     });
      //     profile = {
      //       uid: user.sub,
      //       credits: 10,
      //     };
      //   } else {
      //     profile = data[0];
      //     await db.collection("profiles").updateOne(
      //       {
      //         uid: user.sub,
      //       },
      //       {
      //         // $set a specific value based on check from UID field.
      //         // $set: {
      //         //     credits: profile.credits + 10
      //         // }
      //         // OR
      //         // Increment the value by 10 in this example
      //         $inc: {
      //           credits: 10,
      //         },
      //       }
      //     );
      //   }

      //   return NextResponse.json({ success: true }, { status: 200 });
      return NextResponse.json(
        { success: true, session: stripeSession },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.error();
    }
  }
);

// Notes
// So we have two tables in DB. we find data associated between a post and profile by assigning uid value from auth0. That way when querying you can get the right data for the specific user from different places.
