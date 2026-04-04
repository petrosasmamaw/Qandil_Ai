// Debug endpoint to check environment variables on Vercel
export async function GET() {
  const vars = {
    DATABASE_URL: !!process.env.DATABASE_URL ? "✓ SET" : "❌ MISSING",
    BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET ? "✓ SET" : "❌ MISSING",
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "❌ MISSING",
    NODE_ENV: process.env.NODE_ENV || "not-set",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "not-set",
    EMAIL_USER: !!process.env.EMAIL_USER ? "✓ SET" : "❌ MISSING",
  };

  return Response.json(vars, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
