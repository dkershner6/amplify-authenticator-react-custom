import { useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import { ConsoleLogger as Logger } from "@aws-amplify/core";
import invariant from "tiny-invariant";

import { AuthDataContext } from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

import { useCheckContact } from "./useCheckContact";

export interface UseConfirmSignInOutput {
    confirm: (code: string) => Promise<void>;
    mfaType: string;
}

const logger = new Logger("useConfirmSignIn");

export const useConfirmSignIn = (): UseConfirmSignInOutput => {
    invariant(
        Auth && typeof Auth.confirmSignIn === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { authData } = useContext(AuthDataContext);
    const checkContact = useCheckContact();

    const mfaType =
        authData && authData.challengeName === "SOFTWARE_TOKEN_MFA"
            ? "TOTP"
            : "SMS";

    const confirm = async (code: string): Promise<void> => {
        try {
            await Auth.confirmSignIn(
                authData,
                code,
                mfaType === "TOTP" ? "SOFTWARE_TOKEN_MFA" : null
            );
            checkContact(authData);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    };

    return {
        confirm,
        mfaType,
    };
};
