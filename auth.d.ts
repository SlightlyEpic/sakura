type IfThen<T, V> = T extends true ? V : undefined;

type __OAuthProvider = 'github' | 'google';

// auth.d.ts
declare module '#auth-utils' {
    interface User {
        oauth: boolean;
        oauthProvider?: __OAuthProvider;
        oauthId?: `${__OAuthProvider}|${string}`;
        userId: string;
        roles: string[];
    }

    interface UserSession {}

    interface SecureSessionData {}
}

export { }
