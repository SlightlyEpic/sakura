import { and, eq } from 'drizzle-orm';
import { users } from '~/server/database/schema';
import { type useDB } from '~/server/utils/db';

/**
 * @param drizzle drizzle instance
 * @param email email of the user
 * @param passwordHash hashed password of the user
 */
export async function getUserWithRoles(
    drizzle: ReturnType<typeof useDB>,
    email: string,
) {
    const user = await drizzle.query.users.findFirst({
        where: eq(users.email, email),
        with: {
            roles: {
                columns: {
                    role: true,
                }
            },
        }
    });

    return user;
}
