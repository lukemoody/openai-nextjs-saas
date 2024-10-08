import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

const withApiAuthRequiredExtended = withApiAuthRequired as any;
export const GET = withApiAuthRequiredExtended(
  async (request: NextRequest, response: NextResponse) => {
    const { db } = await connectToDatabase();
    try {
      const session = await getSession(request, response);
      const user = session?.user;

      if (!user) {
        return NextResponse.error();
      }

      // Query DB data using UID to get all posts for user from collection posts.
      // user.sub is basically the ID of the user that was created in Auth0
      const data = await db
        .collection("posts")
        .find({
          uid: user.sub,
        })
        .toArray();

      return NextResponse.json(
        {
          success: true,
          posts: data,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.error();
    }
  }
);
