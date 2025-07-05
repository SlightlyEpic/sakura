import { pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.sql';
import { relations } from 'drizzle-orm';

export const userRoles = pgTable('user_roles', {
    id: serial('id').primaryKey(),
    role: varchar('role', { length: 64 }).notNull(),
    userId: uuid('user_id').references(() => users.id),
});

export const userRolesRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id],
    })
}));
