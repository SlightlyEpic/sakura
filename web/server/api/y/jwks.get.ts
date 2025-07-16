export default defineEventHandler(async (event) => {
    type JwkResponseBody = {
        "keys": Array<{
            alg:string,
            crv:string,
            x:string,
            kty:string,
            kid:string,
        }>
    }

    const resp = (await $fetch<JwkResponseBody>('/api/auth/jwks'));
    return resp.keys[0];
});
