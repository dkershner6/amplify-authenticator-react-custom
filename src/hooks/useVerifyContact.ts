import { useContext, useState } from "react";

import { Auth } from "@aws-amplify/auth";
import invariant from "tiny-invariant";

import { AuthDataContext, AuthRoute } from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export interface UseVerifyContactOutput {
    verifyAttr: string | null;
    verify: (contact: string) => Promise<void>;
    submit: (code: string) => Promise<void>;
}

export const useVerifyContact = (): UseVerifyContactOutput => {
    invariant(
        (Auth && typeof Auth.verifyCurrentUserAttribute === "function") ||
            typeof Auth.verifyCurrentUserAttributeSubmit === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { dispatchAuthState, authData } = useContext(AuthDataContext);
    const [verifyAttr, setVerifyAttr] = useState<string | null>(null);

    const verify = async (contact: string): Promise<void> => {
        try {
            const data = await Auth.verifyCurrentUserAttribute(contact);
            console.debug(data);
            setVerifyAttr(contact);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const submit = async (code: string): Promise<void> => {
        if (!verifyAttr) {
            return;
        }

        try {
            await Auth.verifyCurrentUserAttributeSubmit(verifyAttr, code);
            dispatchAuthState({ authRoute: AuthRoute.SignedIn, authData });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        verifyAttr,
        verify,
        submit,
    };
};
