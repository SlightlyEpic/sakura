import { z } from "zod";

const routeParams = z.object({
    room: z.string().min(1),
    userId: z.string().min(1),
})

type PermResponse = {
    yroom: string,
    yaccess: 'rw' | 'read-only' | 'no-access',
    yuserid: string,
}

export default defineEventHandler((event) => {
    const params = getValidatedRouterParams(event, routeParams.parse);
});
