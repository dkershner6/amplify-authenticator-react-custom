import { useCallback, useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import invariant from "tiny-invariant";

import {
    AuthStateContext,
    AuthData,
    AuthRoute,
    AuthState,
} from "../context/AuthStateContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

import { isEmptyObject } from "./utils";

export type UseCheckContactOutput = (authData: AuthData) => Promise<void>;

export const checkContactBuilder =
    (dispatchAuthState: (authState: Partial<AuthState>) => void) =>
    async (authData: AuthData): Promise<void> => {
        invariant(
            Auth && typeof Auth.verifiedContact === "function",
            AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE,
        );

        const data = await Auth.verifiedContact(authData);

        if (!isEmptyObject(data.verified)) {
            console.debug("checkContact success", authData);
            dispatchAuthState({ authRoute: AuthRoute.SignedIn, authData });
            return;
        }

        const newUser = Object.assign(authData, data);
        console.debug("contact must be verified", newUser);
        dispatchAuthState({
            authRoute: AuthRoute.VerifyContact,
            authData: newUser,
        });
    };

export const useCheckContact = (): UseCheckContactOutput => {
    const { dispatchAuthState } = useContext(AuthStateContext);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(checkContactBuilder(dispatchAuthState), [
        dispatchAuthState,
    ]);
};
