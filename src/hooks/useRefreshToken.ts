import { useCallback } from "react";

import { Auth, CognitoUser } from "@aws-amplify/auth";
import { CognitoUserSession } from "amazon-cognito-identity-js";

export type UseRefreshTokenOutput = () => Promise<string | null>;

export const useRefreshToken = (): UseRefreshTokenOutput => {
    return useCallback(() => {
        // Going old school to handle callback (refreshSession)
        return new Promise<string | null>((resolve) => {
            console.debug("Auth - Refreshing token");
            Auth.currentAuthenticatedUser()
                .then((cognitoUser: CognitoUser) => {
                    const currentSession =
                        cognitoUser.getSignInUserSession() as CognitoUserSession;
                    cognitoUser.refreshSession(
                        currentSession.getRefreshToken(),
                        (error, session) => {
                            if (error) {
                                console.error(
                                    "Auth - Unable to refresh Token",
                                    error,
                                );
                                resolve(null);
                            }
                            const { accessToken } = session;
                            const jwtToken = accessToken.getJwtToken();

                            resolve(jwtToken);
                        },
                    );
                })
                .catch((e) => {
                    console.error("Auth - Unable to refresh Token", e);
                    resolve(null);
                });
        });
    }, []);
};
