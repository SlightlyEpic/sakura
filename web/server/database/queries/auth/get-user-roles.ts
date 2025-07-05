import { eq } from 'drizzle-orm';
import { userRoles } from '~/server/database/schema';
import { type useDB } from '~/server/database/db';

/**
 * @param drizzle drizzle instance
 * @param userId userId from the users table
 */
export async function getUserRoles(
    drizzle: ReturnType<typeof useDB>,
    userId: string,
) {
    const rows = await drizzle.query.userRoles.findMany({
        columns: {
            role: true,
        },
        where: eq(userRoles.userId, userId)
    });

    return rows.map(row => row.role);
}
