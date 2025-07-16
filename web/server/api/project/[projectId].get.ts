import { z } from "zod";
import { StatusCodes } from 'http-status-codes';
import humanId from 'human-id'
import { auth } from "~/server/lib/auth";
import { db } from "~/server/database/db";
import { sql } from "drizzle-orm";

const routeParams = z.object({
    projectId: z.string().min(1),
});

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession(event);

    if(!session) {
        setResponseStatus(event, StatusCodes.UNAUTHORIZED);
        return {
            message: 'Log in is required',
        };
    }

    const params = await getValidatedRouterParams(event, routeParams.parse);

    const project = await db.query.project.findFirst({
        where: (fields, operators) => {
            return operators.eq(fields.id, sql.placeholder(params.projectId)) &&
                operators.eq(fields.ownerId, sql.placeholder(session.user.id))
        },
    })
    
    return project;
});
