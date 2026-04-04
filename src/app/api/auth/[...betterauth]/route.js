import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = handler.GET;

export const POST = async (request) => {
  try {
    console.log("🔐 Auth request received:", request.nextUrl.pathname);
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is not set in environment variables");
      return new Response(JSON.stringify({ error: "Database configuration missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if BETTER_AUTH_SECRET is set
    if (!process.env.BETTER_AUTH_SECRET) {
      console.error("❌ BETTER_AUTH_SECRET is not set");
      return new Response(JSON.stringify({ error: "Auth configuration missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("✓ Auth environment variables present");
    console.log("✓ BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
    
    return handler.POST(request);
  } catch (error) {
    console.error("❌ Auth route error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
