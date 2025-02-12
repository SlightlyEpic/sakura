import pg from 'postgres';
import { users } from '~/server/database/schema';
import { type useDB } from '~/server/utils/db';
import { isUniqueViolation } from '~/server/utils/pg-error';

/**
 * @param drizzle drizzle instance
 * @param name A valid username
 * @param email A valid email
 * @param passwordHash Password hash (only for email signup)
 */
export async function createNewUser(
    drizzle: ReturnType<typeof useDB>,
    name: string,
    email: string,
    passwordHash?: string,
) {
    try {
        const [user] = await drizzle.insert(users)
        .values({ name, email, passwordHash, verified: true })
        .returning();

        return user;
    } catch(err: unknown) {
        if(err instanceof pg.PostgresError && isUniqueViolation(err)) {
            throw createError({
                status: 400,
                statusMessage: 'Email already in use',
                cause: err,
            });
        }
        
        throw err;
    }
}
