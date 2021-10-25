import { useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import useScript from "react-script-hook";
import invariant from "tiny-invariant";

import { AuthDataContext, AuthRoute } from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export interface AmazonFederationProps {
    clientId: string;
    scriptSrc?: string;
}

interface UserInfo {
    success: boolean;
    profile: Record<string, string>;
}

interface AuthorizeResponse {
    access_token?: string;
    expires_in: number;
    error?: Error;
}

interface UseAmazonFederationOutput {
    loading: boolean;
    error: ErrorEvent | null;
    signIn: () => void;
    signOut: () => void;
}

export const useAmazonFederation = (
    props: AmazonFederationProps
): UseAmazonFederationOutput => {
    invariant(
        Auth &&
            typeof Auth.federatedSignIn === "function" &&
            typeof Auth.currentAuthenticatedUser === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { clientId, scriptSrc = "https://api-cdn.amazon.com/sdk/login1.js" } =
        props;

    const { dispatchAuthState } = useContext(AuthDataContext);

    const [loading, error] = useScript({
        src: scriptSrc,
        onload: () => {
            console.debug("init amazon");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const amz = (window as any).amazon;
            amz.Login.setClientId(clientId);
        },
    });

    const federatedSignIn = (response: AuthorizeResponse): void => {
        const { access_token: accessToken, expires_in: expiresIn } = response;

        if (!accessToken) {
            return;
        }

        const expiresAt = expiresIn * 1000 + Date.now();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const amz = (window as any).amazon;

        amz.Login.retrieveProfile(async (userInfo: UserInfo) => {
            if (!userInfo.success) {
                console.debug("Get user Info failed");
                return;
            }

            const user = {
                name: userInfo.profile.Name,
                email: userInfo.profile.PrimaryEmail,
            };

            await Auth.federatedSignIn(
                "amazon",
                { token: accessToken, expires_at: expiresAt },
                user
            );
            const authUser = await Auth.currentAuthenticatedUser();

            dispatchAuthState({
                authRoute: AuthRoute.SignedIn,
                authData: authUser,
            });
        });
    };

    const signIn = (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const amz = (window as any).amazon;
        const options = { scope: "profile" };

        amz.Login.authorize(options, async (response: AuthorizeResponse) => {
            if (response.error) {
                console.debug("Failed to login with amazon: " + response.error);
                return;
            }

            federatedSignIn(response);
        });
    };

    const signOut = (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const amz = (window as any).amazon;

        if (!amz) {
            console.debug("Amazon Login sdk undefined");
            return;
        }

        console.debug("Amazon signing out");
        amz.Login.logout();
    };

    return {
        loading,
        error,
        signIn,
        signOut,
    };
};
