import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email";
import { getVerificationEmailTemplate, getPasswordResetEmailTemplate } from "./emailTemplates";

console.log("🔧 Initializing Prisma client...");
console.log("📍 Database URL present:", !!process.env.DATABASE_URL);

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

// Test database connection
prisma.$connect()
  .then(() => console.log("✓ Database connection successful"))
  .catch((error) => console.error("❌ Database connection failed:", error));

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        "http://localhost:3000",
        "https://qandil-ai.vercel.app"
    ],
    
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            const html = getPasswordResetEmailTemplate(user.name || user.email, url);
            void sendPasswordResetEmail({
                to: user.email,
                subject: "Reset your password",
                html,
            });
        },
        onPasswordReset: async ({ user }, request) => {
            console.log(`✅ Password for user ${user.email} has been successfully reset.`);
        },
    },

    emailVerification: {
        sendVerificationEmail: async ({ user, url }, request) => {
            const html = getVerificationEmailTemplate(user.name || user.email, url);
            console.log("📧 Sending verification email to:", user.email);
            void sendVerificationEmail({
                to: user.email,
                subject: "Verify your email address",
                html,
            });
        },
        sendOnSignUp: true,
    },

    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID || "", 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" 
        },
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
        }
    },
    plugins: [nextCookies()],
});
