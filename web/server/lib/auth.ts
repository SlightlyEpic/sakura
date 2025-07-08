import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { useDB } from '../database/db';

const db = useDB();

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: {
            clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID as string,
            clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET as string,
        }
    }
});
