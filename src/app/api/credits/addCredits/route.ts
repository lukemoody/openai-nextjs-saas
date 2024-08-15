import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

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
      let profile;
      const data = await db
        .collection("profiles")
        .find({
          uid: user.sub,
        })
        .toArray();
      if (data.length === 0) {
        await db.collection("profiles").insertOne({
          uid: user.sub,
          credits: 10,
        });
        profile = {
          uid: user.sub,
          credits: 10,
        };
      } else {
        profile = data[0];
        await db.collection("profiles").updateOne(
          {
            uid: user.sub,
          },
          {
            // $set a specific value based on check from UID field.
            // $set: {
            //     credits: profile.credits + 10
            // }
            // OR
            // Increment the value by 10 in this example
            $inc: {
              credits: 10,
            },
          }
        );
      }
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      return NextResponse.error();
    }
  }
);

// Notes
// So we have two tables in DB. we find data associated between a post and profile by assigning uid value from auth0. That way when querying you can get the right data for the specific user from different places.
