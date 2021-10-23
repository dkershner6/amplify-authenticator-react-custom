import { useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import { ConsoleLogger as Logger } from "@aws-amplify/core";
import useScript from "react-script-hook";
import invariant from "tiny-invariant";

import { AuthDataContext, AuthRoute } from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

const logger = new Logger("useAmazonFederation");

export interface GoogleFederationProps {
    clientId: string;
    scriptSrc?: string;
}

interface GoogleUser {
    getAuthResponse: () => { id_token: string; expires_at: number };
    getBasicProfile: () => {
        getEmail: () => string;
        getName: () => string;
        getImageUrl: () => string;
    };
}

export interface UseGoogleFederationOutput {
    loading: boolean;
    error: ErrorEvent | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useGoogleFederation = (
    props: GoogleFederationProps
): UseGoogleFederationOutput => {
    invariant(
        Auth &&
            typeof Auth.federatedSignIn === "function" &&
            typeof Auth.currentAuthenticatedUser === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { clientId, scriptSrc = "https://apis.google.com/js/platform.js" } =
        props;

    const { handleStateChange } = useContext(AuthDataContext);

    const [loading, error] = useScript({
        src: scriptSrc,
        onload: () => {
            logger.debug("init gapi");

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const g = (window as any).gapi;

            g.load("auth2", () => {
                g.auth2.init({
                    client_id: clientId,
                    scope: "profile email openid",
                });
            });
        },
    });

    const federatedSignIn = async (googleUser: GoogleUser): Promise<void> => {
        const { id_token: idToken, expires_at: expiresAt } =
            googleUser.getAuthResponse();

        const profile = googleUser.getBasicProfile();

        const user = {
            email: profile.getEmail(),
            name: profile.getName(),
            picture: profile.getImageUrl(),
        };

        await Auth.federatedSignIn(
            "google",
            { token: idToken, expires_at: expiresAt },
            user
        );

        const authUser = await Auth.currentAuthenticatedUser();

        handleStateChange(AuthRoute.SignedIn, authUser);
    };

    const signIn = async (): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ga = (window as any).gapi.auth2.getAuthInstance();

        const googleUser = await ga.signIn();

        return federatedSignIn(googleUser);
    };

    const signOut = async (): Promise<void> => {
        const googleAuth =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).gapi && (window as any).gapi.auth2
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (window as any).gapi.auth2.getAuthInstance()
                : null;

        if (!googleAuth) {
            logger.debug("google Auth undefined");
            return Promise.resolve();
        }

        logger.debug("google signing out");
        await googleAuth.signOut();
    };

    return {
        loading,
        error,
        signIn,
        signOut,
    };
};
