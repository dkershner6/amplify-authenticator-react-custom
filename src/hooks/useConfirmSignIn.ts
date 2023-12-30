import { Auth } from "@aws-amplify/auth";
import { useContext } from "react";

import invariant from "tiny-invariant";

import { useCheckContact } from "./useCheckContact";
import { AuthStateContext } from "../context/AuthStateContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export interface UseConfirmSignInOutput {
    confirm: (code: string) => Promise<void>;
    mfaType: string;
}

export const useConfirmSignIn = (): UseConfirmSignInOutput => {
    invariant(
        Auth && typeof Auth.confirmSignIn === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE,
    );

    const { authData } = useContext(AuthStateContext);
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
                mfaType === "TOTP" ? "SOFTWARE_TOKEN_MFA" : null,
            );
            await checkContact(authData);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        confirm,
        mfaType,
    };
};
