import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { useDB } from '../database/db';

const db = useDB();

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
});
