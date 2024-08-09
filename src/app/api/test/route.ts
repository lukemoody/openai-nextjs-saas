import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

// withApiAuthRequiredExtended is a work around to get withApiAuthRequired working with request: NextRequest, response: NextResponse params and types...
// Worked in Next.13...
// Now if your not logged in and go to http://localhost:3000/api/test you will get an error message, which shows this API route is now protected as well.
const withApiAuthRequiredExtended = withApiAuthRequired as any;
export const GET = withApiAuthRequiredExtended(
  async (request: NextRequest, response: NextResponse) => {
    //   const { db } = await connectToDatabase();
    try {
      // const test = await db.collection("test").find({}).toArray();
      // return NextResponse.json({ message: "Hello World", data: test }, { status: 200 });

      // TODO: Below added just to test api route in browser
      return NextResponse.json(
        { message: "Hello World", data: "test" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.error();
    }
  }
);
