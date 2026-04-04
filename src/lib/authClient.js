import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    // use same origin by default; set NEXT_PUBLIC_AUTH_BASE_URL for custom base
    baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL || ""
})
