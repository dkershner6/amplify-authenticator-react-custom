import { Context, createContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthData = any;

export enum AuthRoute {
    ConfirmSignIn = "confirmSignIn",
    ConfirmSignUp = "confirmSignUp",
    ForgotPassword = "forgotPassword",
    RequireNewPassword = "requireNewPassword",
    SignIn = "signIn",
    SignUp = "signUp",
    SignedIn = "signedIn",
    SignedOut = "signedOut",
    SignedUp = "signedUp",
    TOTPSetup = "TOTPSetup",
    VerifyContact = "verifyContact",
}

export interface AuthState {
    authRoute: AuthRoute;
    authData?: AuthData;
}

export interface AuthDataContextOutput extends AuthState {
    handleStateChange: (authState: AuthRoute, authData: AuthData) => void;
}

function createNamedContext<T>(name: string, defaultValue: T): Context<T> {
    const context = createContext<T>(defaultValue);
    context.displayName = name;

    return context;
}

export const AuthDataContext = createNamedContext<AuthDataContextOutput>(
    "Auth",
    undefined as unknown as AuthDataContextOutput
);
