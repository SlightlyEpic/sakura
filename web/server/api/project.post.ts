import { z } from "zod";
import { StatusCodes } from 'http-status-codes';
import { humanId } from 'human-id'
import { auth } from "~/server/lib/auth";
import { db } from "~/server/database/db";
import { project } from "~/server/database/schema";

const bodySchema = z.object({
    name: z.string().min(1),
    description: z.optional(z.string().min(1)),
});

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession(event);

    if(!session) {
        throw createError({
            statusCode: StatusCodes.UNAUTHORIZED,
            message: 'Log in is required',
        })
    }

    const body = await readValidatedBody(event, bodySchema.parse);

    const createdProject = (await db
        .insert(project)
        .values({
            name: body.name,
            description: body.description,
            humanId: humanId({ capitalize: false, separator: '-' }),
            ownerId: session.user.id,
        })
        .returning())[0];
    
    return {
        message: 'Project created successfully',
        project: createdProject,
    };
});
