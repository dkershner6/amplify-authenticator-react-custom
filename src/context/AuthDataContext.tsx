import React, { Context, createContext, useEffect, useReducer } from "react";

import { Auth } from "@aws-amplify/auth";
import { HubCapsule, Hub } from "@aws-amplify/core";
import invariant from "tiny-invariant";

import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "..";

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
    dispatchAuthState: (authState: Partial<AuthState>) => void;
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

export interface AuthProps {
    initialAuthRoute?: AuthRoute;
}

const reducer = (prev: AuthState, newState: Partial<AuthState>): AuthState => {
    if (newState.authRoute === AuthRoute.SignedOut) {
        return { ...prev, ...newState, authRoute: AuthRoute.SignIn };
    }

    return {
        ...prev,
        ...newState,
    };
};

export const AuthDataProvider: React.FC<AuthProps> = (props) => {
    invariant(
        Auth && typeof Auth.currentAuthenticatedUser === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { initialAuthRoute: initialAuthState = AuthRoute.SignIn, children } =
        props;

    const [authState, dispatchAuthState] = useReducer(reducer, {
        authRoute: initialAuthState,
        authData: null,
    });

    useEffect(() => {
        const checkUser = async (): Promise<void> => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                dispatchAuthState({
                    authRoute: AuthRoute.SignedIn,
                    authData: user,
                });
            } catch (error) {
                dispatchAuthState({
                    authRoute: initialAuthState,
                });
            }
        };
        checkUser();
    }, [initialAuthState]);

    useEffect(() => {
        const handleAuthCapsule = (capsule: HubCapsule): void => {
            const { payload } = capsule;

            switch (payload.event) {
                case "cognitoHostedUI":
                    return dispatchAuthState({
                        authRoute: AuthRoute.SignedIn,
                        authData: payload.data,
                    });
                case "cognitoHostedUI_failure":
                case "parsingUrl_failure":
                case "signOut":
                case "customGreetingSignOut":
                    return dispatchAuthState({
                        authRoute: AuthRoute.SignIn,
                        authData: null,
                    });

                default:
                    //TODO
                    return;
            }
        };
        Hub.listen("auth", handleAuthCapsule);

        return (): void => {
            Hub.remove("auth", handleAuthCapsule);
        };
    });

    return (
        <AuthDataContext.Provider
            value={{
                ...authState,
                dispatchAuthState,
            }}
        >
            {children}
        </AuthDataContext.Provider>
    );
};
