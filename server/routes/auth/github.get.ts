import { eq } from 'drizzle-orm';

import { users } from '~/server/database/schema';
import { useDB } from '~/server/utils/db';
import { queries } from '~/server/database/queries';

import { type AuthUser } from '~/shared/utils/types';

export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true
    },
    async onSuccess(event, { user, tokens }) {
        try {
            const db = useDB();
            user.email = user.email.toLowerCase();

            let dbUser = await db.query.users.findFirst({
                where: eq(users.email, user.email)
            });

            if(!dbUser) {
                // User does not exist, create one
                dbUser = await queries.auth.createNewUser(db, user.login as string, user.email as string);
            }

            const roles = await queries.auth.getUserRoles(db, dbUser.id);

            await setUserSession(event, {
                user: {
                    name: dbUser.name,
                    email: dbUser.email,
                    oauth: true,
                    oauthProvider: 'github',
                    oauthId: `github|${user.id}`,
                    userId: dbUser.id,
                    roles: roles,
                } satisfies AuthUser,
            });
            
            return sendRedirect(event, '/')
        } catch(err: any) {
            console.error('err: ', err);
            return sendRedirect(event, `/?error=${err.message}`)
        }
    },
})