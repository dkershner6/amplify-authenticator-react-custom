import { useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import invariant from "tiny-invariant";

import {
    AuthDataContext,
    AuthData,
    AuthRoute,
} from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

import { isEmptyObject } from "./utils";

export type UseCheckContactOutput = (authData: AuthData) => Promise<void>;

export const useCheckContact = (): UseCheckContactOutput => {
    const { dispatchAuthState } = useContext(AuthDataContext);

    return async (authData: AuthData): Promise<void> => {
        invariant(
            Auth && typeof Auth.verifiedContact === "function",
            AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
        );

        const data = await Auth.verifiedContact(authData);

        if (!isEmptyObject(data.verified)) {
            console.debug("checkContact success", authData);
            dispatchAuthState({ authRoute: AuthRoute.SignIn, authData });
            return;
        }

        const newUser = Object.assign(authData, data);
        console.debug("contact must be verified", newUser);
        dispatchAuthState({
            authRoute: AuthRoute.VerifyContact,
            authData: newUser,
        });
    };
};
