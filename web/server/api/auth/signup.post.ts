import { useDB } from '~/server/database/db';
import { queries } from '~/server/database/queries';
import { signupBodySchema } from '~/shared/api-schema/auth';

import { type AuthUser } from '~/shared/utils/types';

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, signupBodySchema.parse);

    const db = useDB();

    const passwordHash = await hashPassword(body.password);
    
    const dbUser = await queries.auth.createNewUser(db, body.name, body.email, passwordHash);
    await setUserSession(event, {
        user: {
            name: dbUser.name,
            email: dbUser.email,
            oauth: false,
            userId: dbUser.id,
            roles: [],
        } satisfies AuthUser
    })

    return {
        message: 'success'
    };
});