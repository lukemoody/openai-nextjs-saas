import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import OpenAI from "openai";

const withApiAuthRequiredExtended = withApiAuthRequired as any;

export const POST = withApiAuthRequiredExtended(
  async (request: NextRequest, response: NextResponse) => {
    // Connect to DB controller
    const { db } = await connectToDatabase();

    try {
      // Check user is authenticated and allowed access
      const session = await getSession(request, response);
      const user = session?.user;

      // Return error if user does not exist
      if (!user) {
        return NextResponse.error();
      }

      // Destructure body off the request object
      const body = await request.json();
      const { description, title, keywords, tone } = body as PostPrompt;

      // OpenAI
      // https://www.npmjs.com/package/openai
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Construct prompt to generate the post title
      const _generateTitle = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a blog post writer",
          },
          {
            role: "user",
            content: `Write me a title for a blog post about ${description}. The keywords for the post are as follows: ${keywords}. The tone of the post should be ${tone}. The title should be SEO friendly and no longer than 15 words. Write only one title. ${
              title.length > 0
                ? `Take that title into consideration: ${title}.`
                : ""
            }}. Do not wrap the title in quotes.`,
          },
        ],
        temperature: 0.2,
      });

      const titleResponse = _generateTitle.choices[0]?.message?.content;

      // Construct prompt to generate the post body
      const _generatePost = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a blog post writer",
          },
          {
            role: "user",
            content: `Write me a long and interesting blog post about ${description}. The title of the article is as follows: ${titleResponse}. These are the keywords for the post: ${keywords}. The blog post should be long and SEO friendly. The tone of the post should be ${tone}. Write it as well as you can. Do not include the title in the post, just start writing the post. Divide the post into paragraphs and write at least 3 paragraphs. Distinguish the paragraphs with a line break.`,
          },
        ],
        temperature: 0.2,
      });

      const postResponse = _generatePost.choices[0]?.message?.content;

      const _paragraphs = postResponse?.split("\n\n");

      // Construct post object based on response from OpenAI
      const post: Post = {
        title: titleResponse || "No title generated",
        content: _paragraphs || ["No content generated"],
        uid: user.sub,
      };

      // Add post to database
      await db.collection("posts").insertOne(post);

      // Return the post object
      return NextResponse.json({ success: true, post: post }, { status: 200 });
    } catch (error) {
      return NextResponse.error();
    }
  }
);
