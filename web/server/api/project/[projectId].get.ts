import { z } from "zod";
import { StatusCodes } from 'http-status-codes';
import { auth } from "~/server/lib/auth";
import { db } from "~/server/database/db";
import { sql } from "drizzle-orm";

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

    const project = await db.query.project.findFirst({
        where: (fields, operators) => {
            return operators.eq(fields.id, params.projectId) &&
                operators.eq(fields.ownerId, session.user.id)
        },
    })
    
    return project;
});
