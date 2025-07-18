import { z } from "zod";
import { StatusCodes } from 'http-status-codes';
import { auth } from "~/server/lib/auth";
import { db } from "~/server/database/db";
import { and, eq, sql } from "drizzle-orm";
import { project } from "~/server/database/schema";

const routeParams = z.object({
    projectId: z.coerce.number().min(1),
});

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession(event);

    if(!session) {
        throw createError({
            statusCode: StatusCodes.UNAUTHORIZED,
            message: 'Log in is required',
        })
    }

    const params = await getValidatedRouterParams(event, routeParams.parse);

    const deleteResult = await db
        .delete(project)
        .where(and(
            eq(project.ownerId, session.user.id),
            eq(project.id, params.projectId),
        ))
        .returning();
    
    return {
        message: 'Successfully deleted',
        project: deleteResult.length > 0 ? deleteResult[0] : undefined,
    };
});
