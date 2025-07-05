import { useDB } from '~/server/database/db';
import { queries } from '~/server/database/queries';
import { loginBodySchema } from '~/shared/api-schema/auth';

import { type AuthUser } from '~/shared/utils/types';

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, loginBodySchema.parse);

    const db = useDB();

    const dbUser = await queries.auth.getUserWithRoles(db, body.email);
    const passwordMatches = dbUser && dbUser.passwordHash && (await verifyPassword(dbUser.passwordHash, body.password));

    if(!dbUser || !passwordMatches) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        });
    }

    await setUserSession(event, {
        user: {
            name: dbUser.name,
            email: dbUser.email,
            oauth: false,
            userId: dbUser.id,
            roles: dbUser.roles.map(r => r.role),
        } satisfies AuthUser
    });

    return {
        message: 'success'
    };
});
