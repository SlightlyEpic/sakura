import { createNewUser } from './create-new-user';
import { getUserByEmail } from './get-user-by-email';
import { getUserRoles } from './get-user-roles';
import { getUserWithRoles } from './get-user-with-roles';

export const auth = {
    createNewUser,
    getUserByEmail,
    getUserRoles,
    getUserWithRoles
};
