export interface UserStateBranch {
    id?: number;
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
    id: number;
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

export interface UpdateUserAction {
    payload: UpdateUserRequest;
    type: string;
}

export interface UpdateUserRequest {
    update: {
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
    };
    email: string;
    password: string;
}
