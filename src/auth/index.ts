import { Lucia } from "lucia";
import dbAdapter from "@/auth/dbAdapter";

const adapter = dbAdapter;

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      emailVerified: attributes.emailVerified,
      email: attributes.email,
      stripe_customer_id: attributes.stripe_customer_id,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      emailVerified: boolean;
      stripe_customer_id?: string;
    };
  }
}
