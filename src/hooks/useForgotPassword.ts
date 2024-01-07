import { useContext, useState } from "react";

import { Auth } from "@aws-amplify/auth";
import invariant from "tiny-invariant";

import { AuthStateContext, AuthRoute } from "../context/AuthStateContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export interface UseForgotPasswordOutput {
    username: string | null;
    submit: (code: string, password: string) => Promise<void>;
    send: (usernameValue: string) => Promise<void>;
}

export const useForgotPassword = (): UseForgotPasswordOutput => {
    invariant(
        (Auth && typeof Auth.forgotPassword === "function") ||
            typeof Auth.forgotPasswordSubmit === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE,
    );

    const [username, setUsername] = useState<string | null>(null);

    const { dispatchAuthState } = useContext(AuthStateContext);

    const submit = async (code: string, password: string): Promise<void> => {
        if (!username) {
            throw new Error(
                "username must be populated before submitting a forgotten password code",
            );
        }

        try {
            await Auth.forgotPasswordSubmit(username, code, password);
            dispatchAuthState({ authRoute: AuthRoute.SignIn, authData: null });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const send = async (usernameValue: string): Promise<void> => {
        try {
            await Auth.forgotPassword(usernameValue);
            setUsername(usernameValue);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        username,
        submit,
        send,
    };
};
