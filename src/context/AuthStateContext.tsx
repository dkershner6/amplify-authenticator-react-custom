import React, { Context, createContext, useEffect, useReducer } from "react";

import { Auth } from "@aws-amplify/auth";
import { HubCapsule, Hub } from "@aws-amplify/core";
import invariant from "tiny-invariant";

import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "..";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";

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

export interface AuthStateContextOutput extends AuthState {
    dispatchAuthState: (authState: Partial<AuthState>) => void;
}

function createNamedContext<T>(name: string, defaultValue: T): Context<T> {
    const context = createContext<T>(defaultValue);
    context.displayName = name;

    return context;
}

export const AuthStateContext = createNamedContext<AuthStateContextOutput>(
    "Auth",
    undefined as unknown as AuthStateContextOutput
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

export const AuthStateProvider: React.FC<AuthProps> = (props) => {
    invariant(
        Auth && typeof Auth.currentAuthenticatedUser === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { initialAuthRoute = AuthRoute.SignIn, children } = props;

    const [authState, dispatchAuthState] = useReducer(reducer, {
        authRoute: initialAuthRoute,
        authData: null,
    });

    useIsomorphicLayoutEffect(() => {
        const checkUser = async (): Promise<void> => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                console.debug("user found", user);
                dispatchAuthState({
                    authRoute: AuthRoute.SignedIn,
                    authData: user,
                });
            } catch (error) {
                dispatchAuthState({
                    authRoute: initialAuthRoute,
                });
            }
        };
        checkUser();
    }, []);

    useEffect(() => {
        const handleAuthCapsule = (capsule: HubCapsule): void => {
            const { payload } = capsule;

            switch (payload.event) {
                case "signIn":
                case "refreshToken":
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
    }, []);

    return (
        <AuthStateContext.Provider
            value={{
                ...authState,
                dispatchAuthState,
            }}
        >
            {children}
        </AuthStateContext.Provider>
    );
};
