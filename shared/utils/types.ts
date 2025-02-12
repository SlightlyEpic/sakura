type __OAuthProvider = 'github' | 'google';

type OAuthUser = {
    oauth: true,
    oauthProvider: __OAuthProvider,
    oauthId: `${__OAuthProvider}|${string}`,
    userId: string,
    roles: string[],
};

type EmailUser = {
    oauth: false,
    userId: string,
    roles: string[],
};

export type AuthUser = OAuthUser | EmailUser;
