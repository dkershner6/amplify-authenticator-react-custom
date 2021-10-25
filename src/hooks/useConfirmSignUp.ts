import { useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import invariant from "tiny-invariant";

import { AuthStateContext, AuthRoute } from "../context/AuthStateContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export interface UseConfirmSignUpOutput {
    confirm: (code: string) => Promise<void>;
    resend: () => Promise<void>;
}

export const useConfirmSignUp = (): UseConfirmSignUpOutput => {
    invariant(
        (Auth && typeof Auth.confirmSignUp === "function") ||
            typeof Auth.resendSignUp === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { dispatchAuthState, authData = {} } = useContext(AuthStateContext);

    const { username } = authData;

    const confirm = async (code: string): Promise<void> => {
        try {
            await Auth.confirmSignUp(username, code);
            dispatchAuthState({
                authRoute: AuthRoute.SignedUp,
                authData: null,
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const resend = async (): Promise<void> => {
        try {
            await Auth.resendSignUp(username);
            console.debug("code resent");
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        confirm,
        resend,
    };
};
