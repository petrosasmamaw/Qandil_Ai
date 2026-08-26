// Debug endpoint to check environment variables
export async function GET() {
  const vars = {
    DATABASE_URL: !!process.env.DATABASE_URL ? "✓ SET" : "❌ MISSING",
    JWT_SECRET: !!process.env.JWT_SECRET ? "✓ SET" : "❌ MISSING",
    NODE_ENV: process.env.NODE_ENV || "not-set",
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "not-set",
    NEXT_PUBLIC_GEMINI_API_KEY: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "✓ SET" : "❌ MISSING",
  };

  return Response.json(vars, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
