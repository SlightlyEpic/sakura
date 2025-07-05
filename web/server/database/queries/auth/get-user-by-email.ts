import { and, eq } from 'drizzle-orm';
import { users } from '~/server/database/schema';
import { type useDB } from '~/server/database/db';

/**
 * @param drizzle drizzle instance
 * @param email email of the user
 * @param passwordHash hashed password of the user
 */
export async function getUserByEmail(
    drizzle: ReturnType<typeof useDB>,
    email: string,
) {
    const user = await drizzle.query.users.findFirst({
        where: eq(users.email, email),
    });

    return user;
}
