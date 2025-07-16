import { betterAuth } from "better-auth";
import { jwt } from 'better-auth/plugins';
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from '../database/db';

export const auth = betterAuth({
    plugins: [
        jwt({
            jwt: {
                definePayload: (session) => {
                    return {
                        id: session.user.id,
                        email: session.user.email,
                        yuserid: session.user.id,
                    }
                }
            }
        }),
    ],
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
