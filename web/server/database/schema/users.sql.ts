import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

import { userRoles } from './userRoles.sql';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    avatarURL: varchar('avatar_url', { length: 512 }),
    email: varchar('email', { length: 255 }).unique().notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    lastLogin: timestamp('last_login').defaultNow(),
    verified: boolean('verified').default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
    roles: many(userRoles),
}));
