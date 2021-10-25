import { useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import invariant from "tiny-invariant";

import { AuthStateContext, AuthRoute } from "../context/AuthStateContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

import { useCheckContact } from "./useCheckContact";

export type UseRequireNewPasswordOutput = (password: string) => Promise<void>;

export const useRequireNewPassword = (): ((
    password: string
) => Promise<void>) => {
    invariant(
        Auth && typeof Auth.completeNewPassword === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { authData: user, dispatchAuthState } = useContext(AuthStateContext);
    const checkContact = useCheckContact();

    return async (password: string): Promise<void> => {
        try {
            const updatedUser = await Auth.completeNewPassword(
                user,
                password,
                undefined
            );

            console.debug("complete new password", updatedUser);

            if (updatedUser.challengeName === "SMS_MFA") {
                dispatchAuthState({
                    authRoute: AuthRoute.ConfirmSignIn,
                    authData: updatedUser,
                });
            } else if (updatedUser.challengeName === "MFA_SETUP") {
                console.debug("TOTP setup", updatedUser.challengeParam);
                dispatchAuthState({
                    authRoute: AuthRoute.TOTPSetup,
                    authData: updatedUser,
                });
            } else {
                checkContact(updatedUser);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
};
