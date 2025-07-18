import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/database/db";

const routeParams = z.object({
    room: z.coerce.number().min(1),
    userId: z.string().min(1),
})

type PermResponse = {
    yroom: string,
    yaccess: 'rw' | 'read-only' | 'no-access',
    yuserid: string,
}

export default defineEventHandler(async (event) => {
    const params = await getValidatedRouterParams(event, routeParams.parse);

    const project = db.query.project.findFirst({
        where: (fields, operators) => {
            return operators.eq(fields.id, params.room) && 
                operators.eq(fields.ownerId, params.userId);
        },
    });

    if(!project) {
        return {
            yroom: params.room.toString(),
            yaccess: 'no-access',
            yuserid: params.userId,
        } satisfies PermResponse;
    }

    return {
        yroom: params.room.toString(),
        yaccess: 'rw',
        yuserid: params.userId,
    } satisfies PermResponse;
});
