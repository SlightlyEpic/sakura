import type { User } from '#auth-utils';

export const viewAuthOnly = defineAbility((user: User) => true);
export const viewAdminOnly = defineAbility((user: User) => user.roles.includes('admin'));
