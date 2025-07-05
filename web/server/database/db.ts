import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '~/server/database/schema';

const db = drizzle({
    connection: {
        user: process.env.POSTGRES_USER as string,
        password: process.env.POSTGRES_PASSWORD as string,
        host: process.env.POSTGRES_HOST as string,
        port: Number(process.env.POSTGRES_PORT as string),
        database: process.env.POSTGRES_DATABASE as string,
    },
    schema: schema,
});

export function useDB() {
    return db;
}
