import { useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import invariant from "tiny-invariant";

import { AuthDataContext, AuthRoute } from "../context/AuthDataContext";
import { AmplifyError } from "../lib/AmplifyError";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

import { useCheckContact } from "./useCheckContact";

export type UseSignInOuput = (
    username: string,
    password: string,
    validationData?: Record<string, string> | undefined
) => Promise<void>;

export const useSignIn = (): ((
    username: string,
    password: string,
    validationData?: Record<string, string>
) => Promise<void>) => {
    invariant(
        Auth && typeof Auth.signIn === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { handleStateChange } = useContext(AuthDataContext);
    const checkContact = useCheckContact();

    return async (
        username: string,
        password: string,
        validationData?: {
            [key: string]: string;
        }
    ): Promise<void> => {
        try {
            const user = await Auth.signIn({
                username,
                password,
                validationData,
            });
            console.debug(user);
            if (
                user.challengeName === "SMS_MFA" ||
                user.challengeName === "SOFTWARE_TOKEN_MFA"
            ) {
                console.debug("confirm user with " + user.challengeName);
                handleStateChange(AuthRoute.ConfirmSignIn, user);
            } else if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
                console.debug("require new password", user.challengeParam);
                handleStateChange(AuthRoute.RequireNewPassword, user);
            } else if (user.challengeName === "MFA_SETUP") {
                console.debug("TOTP setup", user.challengeParam);
                handleStateChange(AuthRoute.TOTPSetup, user);
            } else {
                checkContact(user);
            }
        } catch (error) {
            if ((error as AmplifyError)?.code === "UserNotConfirmedException") {
                console.debug("the user is not confirmed");
                handleStateChange(AuthRoute.ConfirmSignUp, { username });
            } else if (
                (error as AmplifyError)?.code ===
                "PasswordResetRequiredException"
            ) {
                console.debug("the user requires a new password");
                handleStateChange(AuthRoute.ForgotPassword, { username });
            } else {
                console.error(error);
                throw error;
            }
        }
    };
};
