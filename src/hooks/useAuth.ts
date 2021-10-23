import { useCallback, useEffect, useState } from "react";

import { Auth } from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { HubCapsule } from "@aws-amplify/core/lib/Hub";
import invariant from "tiny-invariant";

import {
    AuthData,
    AuthState,
    AuthDataContextOutput,
    AuthRoute,
} from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export interface AuthProps {
    initialAuthRoute?: AuthRoute;
    onStateChange?: (prevState: AuthState, newState: AuthState) => AuthState;
}

export const useAuth = (props: AuthProps): AuthDataContextOutput => {
    invariant(
        Auth && typeof Auth.currentAuthenticatedUser === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const {
        initialAuthRoute: initialAuthState = AuthRoute.SignIn,
        onStateChange,
    } = props;

    const [state, setState] = useState<AuthState>({
        authRoute: initialAuthState,
        authData: null,
    });

    const handleStateChange = useCallback(
        (authRoute: AuthRoute, authData: AuthData) => {
            if (authRoute === AuthRoute.SignedOut) {
                authRoute = AuthRoute.SignIn;
            }

            setState((prev) => {
                const newState = onStateChange
                    ? onStateChange(prev, { authRoute: authRoute, authData })
                    : { authState: authRoute, authData };
                return {
                    ...prev,
                    ...newState,
                };
            });
        },
        [onStateChange]
    );

    useEffect(() => {
        const checkUser = async (): Promise<void> => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                handleStateChange(AuthRoute.SignedIn, user);
            } catch (error) {
                handleStateChange(initialAuthState, null);
            }
        };
        checkUser();
    }, [handleStateChange, initialAuthState]);

    useEffect(() => {
        const handleAuthCapsule = (capsule: HubCapsule): void => {
            const { payload } = capsule;

            switch (payload.event) {
                case "cognitoHostedUI":
                    handleStateChange(AuthRoute.SignedIn, payload.data);
                    break;
                case "cognitoHostedUI_failure":
                    handleStateChange(AuthRoute.SignIn, null);
                    break;
                case "parsingUrl_failure":
                    handleStateChange(AuthRoute.SignIn, null);
                    break;
                case "signOut":
                    handleStateChange(AuthRoute.SignIn, null);
                    break;
                case "customGreetingSignOut":
                    handleStateChange(AuthRoute.SignIn, null);
                    break;
                default:
                    //TODO
                    break;
            }
        };
        Hub.listen("auth", handleAuthCapsule);

        return (): void => {
            Hub.remove("auth", handleAuthCapsule);
        };
    });

    return {
        ...state,
        handleStateChange,
    };
};
