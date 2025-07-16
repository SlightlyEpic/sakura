import { z } from "zod";
import { auth } from "~/server/lib/auth";
import { minioClient } from "~/server/lib/minio-client";
import { StatusCodes } from 'http-status-codes';

const routeParamsSchema = z.object({
    projectId: z.string().min(1),
    fileId: z.string().min(1),
});

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if(!session || !session.user) {
        setResponseStatus(event, StatusCodes.UNAUTHORIZED);
        return {
            error: 'Unauthorized'
        };
    }

    const params = await getValidatedRouterParams(event, routeParamsSchema.parse);

    const bucketName = 'sakura-user-files';
    const objectName = `${session.user.id}_${params.projectId}_${params.fileId}`;

    // TODO: Verify that the user owns the project and files before allowing this
    const getObjectResult = (await minioClient.getObject(bucketName, objectName)).toArray();
    
    return {
        message: 'Success',
        result: getObjectResult,
    };
});
