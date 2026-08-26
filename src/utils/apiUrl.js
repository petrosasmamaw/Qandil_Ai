/**
 * Helper to ensure reliable backend API base URL resolution
 * Works correctly whether NEXT_PUBLIC_BACKEND_URL is:
 * - https://qandil-ai.onrender.com
 * - https://qandil-ai.onrender.com/api
 * - http://localhost:5000
 * - http://localhost:5000/api
 */
export const getApiBaseUrl = () => {
  let url =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

  url = url.trim().replace(/\/+$/, "");

  if (!url.endsWith("/api")) {
    url += "/api";
  }

  return url;
};

export default getApiBaseUrl;
