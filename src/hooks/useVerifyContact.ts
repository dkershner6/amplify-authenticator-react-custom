import { useContext, useState } from "react";

import { Auth } from "@aws-amplify/auth";
import { ConsoleLogger as Logger } from "@aws-amplify/core";
import invariant from "tiny-invariant";

import { AuthDataContext, AuthRoute } from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export interface UseVerifyContactOutput {
    verifyAttr: string | null;
    verify: (contact: string) => Promise<void>;
    submit: (code: string) => Promise<void>;
}

const logger = new Logger("useVerifyContact");

export const useVerifyContact = (): UseVerifyContactOutput => {
    invariant(
        (Auth && typeof Auth.verifyCurrentUserAttribute === "function") ||
            typeof Auth.verifyCurrentUserAttributeSubmit === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { handleStateChange, authData } = useContext(AuthDataContext);
    const [verifyAttr, setVerifyAttr] = useState<string | null>(null);

    const verify = async (contact: string): Promise<void> => {
        try {
            const data = await Auth.verifyCurrentUserAttribute(contact);
            logger.debug(data);
            setVerifyAttr(contact);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    };

    const submit = async (code: string): Promise<void> => {
        if (!verifyAttr) {
            return;
        }

        try {
            await Auth.verifyCurrentUserAttributeSubmit(verifyAttr, code);
            handleStateChange(AuthRoute.SignedIn, authData);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    };

    return {
        verifyAttr,
        verify,
        submit,
    };
};
