export interface UserStateBranch {
    email?: string;
    firstName?: string;
    lastName?: string;
    avatarSrc?: string;
}

export interface LoginAction {
    payload: {
        email: string,
        password: string,
    };
    type: string;
}

export interface User {
    email: string;
    firstName?: string;
    lastName?: string;
    avatarSrc?: string;
}

export interface SetUserAction {
    payload: User;
    type: string;
}
