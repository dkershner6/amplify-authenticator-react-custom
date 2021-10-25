import { useContext, useState } from "react";

import { Auth } from "@aws-amplify/auth";
import invariant from "tiny-invariant";

import { AuthDataContext, AuthRoute } from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export interface UseForgotPasswordOutput {
    username: string;
    delivery: null;
    submit: (code: string, password: string) => Promise<void>;
    send: (usernameValue: string) => Promise<void>;
}

export const useForgotPassword = (): UseForgotPasswordOutput => {
    invariant(
        (Auth && typeof Auth.forgotPassword === "function") ||
            typeof Auth.forgotPasswordSubmit === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );
    const [delivery, setDelivery] = useState(null);
    const [username, setUsername] = useState("");

    const { dispatchAuthState } = useContext(AuthDataContext);

    const submit = async (code: string, password: string): Promise<void> => {
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
            const data = await Auth.forgotPassword(usernameValue);
            setDelivery(data.CodeDeliveryDetails);
            setUsername(usernameValue);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        username,
        delivery,
        submit,
        send,
    };
};
