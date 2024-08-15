import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";

const withApiAuthRequiredExtended = withApiAuthRequired as any;
export const POST = withApiAuthRequiredExtended(
  async (request: NextRequest, response: NextResponse) => {
    const { db } = await connectToDatabase();
    try {
      // Check if user has right permissions to be here
      const session = await getSession(request, response);
      const user = session?.user;

      if (!user) {
        return NextResponse.error();
      }

      // Destructure _id off the body request
      const body = await request.json();
      const { _id } = body;

      // Use deleteOne function with ID to delete specific post
      // ObjectId is a special function from MongoDB which needs to be used with the ID as its a actual object.
      await db.collection("posts").deleteOne({
        _id: new ObjectId(_id),
      });

      return NextResponse.json(
        {
          success: true,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.error();
    }
  }
);
