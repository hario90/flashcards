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

export interface SignupAction {
    payload: {
        email: string,
        password: string,
        firstName: string,
        lastName: string
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

export interface SignOutAction {
    type: string;
}
