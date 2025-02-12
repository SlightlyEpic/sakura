import { eq } from 'drizzle-orm';

import { users } from '~/server/database/schema';
import { useDB } from '~/server/utils/db';
import { queries } from '~/server/database/queries';

import { type AuthUser } from '~/shared/utils/types';

export default defineOAuthGoogleEventHandler({
    config: {
        scope: ['openid', 'email', 'profile']
    },
    async onSuccess(event, { user, tokens }) {
        try {
            const db = useDB();
            user.email = user.email.toLowerCase();

            let dbUser = await db.query.users.findFirst({
                where: eq(users.email, user.email)
            });

            if (!dbUser) {
                // User does not exist, create one
                dbUser = await queries.auth.createNewUser(db, user.name as string, user.email as string);
            }

            const roles = await queries.auth.getUserRoles(db, dbUser.id);

            await setUserSession(event, {
                user: {
                    oauth: true,
                    oauthProvider: 'google',
                    oauthId: `google|${user.sub}`,
                    userId: dbUser.id,
                    roles: roles,
                } satisfies AuthUser,
            });

            return sendRedirect(event, '/')
        } catch (err: any) {
            console.error('err: ', err);
            return sendRedirect(event, `/?error=${err.message}`)
        }
    },
})