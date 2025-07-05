type __OAuthProvider = 'github' | 'google';

type OAuthUser = {
    name: string,
    email: string,
    oauth: true,
    oauthProvider: __OAuthProvider,
    oauthId: `${__OAuthProvider}|${string}`,
    userId: string,
    roles: string[],
};

type EmailUser = {
    name: string,
    email: string,
    oauth: false,
    userId: string,
    roles: string[],
};

export type AuthUser = OAuthUser | EmailUser;

export type Loadable<T> = {
    loaded: boolean,
    data: T,
};
