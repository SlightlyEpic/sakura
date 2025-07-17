import { z } from "zod";
import { StatusCodes } from 'http-status-codes';
import { auth } from "~/server/lib/auth";
import { db } from "~/server/database/db";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession(event);

    if(!session) {
        setResponseStatus(event, StatusCodes.UNAUTHORIZED);
        return {
            message: 'Log in is required',
        };
    }

    const projects = await db.query.project.findMany({
        where: (fields, operators) => {
            return operators.eq(fields.ownerId, sql.placeholder(session.user.id))
        },
    })
    
    return projects;
});
