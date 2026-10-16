"use client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient, oneTapClient } from "better-auth/client/plugins";
import { ONE_TAP_ID } from "@/lib/live";

/* Browser side of sign-in. Only used when accounts are live (src/lib/live.ts). */
export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [
    emailOTPClient(),
    ...(ONE_TAP_ID ? [oneTapClient({ clientId: ONE_TAP_ID, autoSelect: false, cancelOnTapOutside: true, context: "signin", promptOptions: { maxAttempts: 1 } })] : []),
  ],
});
