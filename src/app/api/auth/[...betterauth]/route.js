import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

let handler;
try {
  handler = toNextJsHandler(auth);
} catch (error) {
  console.error("Failed to initialize auth handler:", error);
}

export const GET = async (request) => {
  try {
    if (!handler) throw new Error("Auth handler not initialized");
    return handler.GET(request);
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const POST = async (request) => {
  try {
    if (!handler) throw new Error("Auth handler not initialized");
    
    console.log("🔐 Auth POST request:", request.nextUrl.pathname);
    console.log("📍 BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
    
    const response = await handler.POST(request);
    return response;
  } catch (error) {
    console.error("❌ Auth POST error:", error.message, error.stack);
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
