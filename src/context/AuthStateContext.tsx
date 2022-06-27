import React, {
    Context,
    createContext,
    useCallback,
    useEffect,
    useReducer,
} from "react";

import { Auth } from "@aws-amplify/auth";
import { HubCapsule, Hub } from "@aws-amplify/core";
import invariant from "tiny-invariant";

import { checkContactBuilder } from "../hooks/useCheckContact";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthData = any;

export enum AuthRoute {
    ConfirmSignIn = "confirmSignIn",
    ConfirmSignUp = "confirmSignUp",
    ForgotPassword = "forgotPassword",
    Loading = "loading",
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

export const AuthStateProvider: React.FC<React.PropsWithChildren<AuthProps>> = (
    props
) => {
    invariant(
        Auth && typeof Auth.currentAuthenticatedUser === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { initialAuthRoute = AuthRoute.SignIn, children } = props;

    const [authState, dispatchAuthState] = useReducer(reducer, {
        // Loading displays nothing, this prevents screen flicker on SSR apps
        authRoute: AuthRoute.Loading,
        authData: null,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkContact = useCallback(checkContactBuilder(dispatchAuthState), [
        dispatchAuthState,
    ]);

    const getAndSetUser = useCallback(async (): Promise<void> => {
        const user = await Auth.currentAuthenticatedUser();
        console.debug("AUTH - user found", user);
        return await checkContact(user);
    }, [checkContact]);

    useIsomorphicLayoutEffect(() => {
        const checkUser = async (): Promise<void> => {
            try {
                await getAndSetUser();
            } catch (error) {
                dispatchAuthState({
                    authRoute: initialAuthRoute,
                });
            }
        };
        checkUser();
    }, [getAndSetUser, initialAuthRoute]);

    useEffect(() => {
        const handleAuthCapsule = async (
            capsule: HubCapsule
        ): Promise<void> => {
            const { payload } = capsule;

            console.debug("AUTH - Hub event detected", payload);
            switch (payload.event) {
                case "signIn":
                case "cognitoHostedUI":
                    return await checkContact(payload.data);
                case "tokenRefresh":
                    // The payload.data is undefined
                    return await getAndSetUser();
                case "cognitoHostedUI_failure":
                case "parsingUrl_failure":
                case "signOut":
                case "customGreetingSignOut":
                    return dispatchAuthState({
                        authRoute: AuthRoute.SignIn,
                        authData: null,
                    });

                default:
                    return;
            }
        };
        Hub.listen("auth", handleAuthCapsule);

        return (): void => {
            Hub.remove("auth", handleAuthCapsule);
        };
    }, [checkContact, getAndSetUser]);

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
