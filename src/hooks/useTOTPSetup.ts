import { useState, useEffect, useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import { ConsoleLogger as Logger } from "@aws-amplify/core";
import invariant from "tiny-invariant";

import { AuthDataContext } from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export interface UseTOTPSetupOutput {
    code: string | null;
    verifyTotpToken: (totpCode: string) => Promise<void>;
}

const logger = new Logger("useTOTPSetup");

export const useTOTPSetup = (): UseTOTPSetupOutput => {
    invariant(
        Auth &&
            typeof Auth.setupTOTP === "function" &&
            typeof Auth.verifyTotpToken === "function" &&
            typeof Auth.setPreferredMFA === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const [code, setCode] = useState<string | null>(null);

    const { authData } = useContext(AuthDataContext);

    const verifyTotpToken = async (totpCode: string): Promise<void> => {
        try {
            await Auth.verifyTotpToken(authData, totpCode);
            Auth.setPreferredMFA(authData, "TOTP");
        } catch (error) {
            logger.error(error);
            throw error;
        }
    };

    useEffect(() => {
        const setup = async (): Promise<void> => {
            const data = await Auth.setupTOTP(authData);
            logger.debug("secret key", data);

            setCode(
                `otpauth://totp/AWSCognito:${authData.username}?secret=${data}&issuer=AWSCognito`
            );
        };
        setup();
    }, [authData]);

    return { code, verifyTotpToken };
};
