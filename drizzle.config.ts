import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './server/database/schema/*.sql.ts',
    out: './server/database/migrations',
    dbCredentials: {
        user: process.env.POSTGRES_USER as string,
        password: process.env.POSTGRES_PASSWORD as string,
        host: process.env.POSTGRES_HOST as string,
        port: Number(process.env.POSTGRES_PORT as string),
        database: process.env.POSTGRES_DATABASE as string,
        ssl: 'prefer'
    },
    entities: {
        roles: {
            provider: 'supabase'
        }
    }
});
