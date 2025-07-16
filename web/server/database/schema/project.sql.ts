import { pgTable, text, timestamp, boolean, integer, serial } from 'drizzle-orm/pg-core';
import { user } from './auth.sql';

export const project = pgTable('project', {
    id: serial('id').primaryKey(),
    ownerId: text('owner_id').notNull().references(() => user.id),
    humanId: text('human_id').notNull().unique(),
    name: text('name').notNull().default(''),
    description: text('description').notNull().default(''),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// export const file = pgTable('file', {
//     id: serial('id').primaryKey(),
//     projectId: integer('project_id').notNull().references(() => project.id),
// });
