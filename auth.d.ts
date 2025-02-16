type __OAuthProvider = 'github' | 'google';

// auth.d.ts
declare module '#auth-utils' {
    interface User {
        name: string;
        email: string;
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
