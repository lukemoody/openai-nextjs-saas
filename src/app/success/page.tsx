"use client";
import Link from "next/link";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

// withPageAuthRequired protects page from unauthorized access
export default withPageAuthRequired(function Page() {
  return (
    <main>
      <h1>Success</h1>
      <Link href="/">Go to Homepage</Link>
    </main>
  );
});
