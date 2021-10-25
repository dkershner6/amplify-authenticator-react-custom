import { useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import invariant from "tiny-invariant";

import { AuthDataContext, AuthRoute } from "../context/AuthDataContext";
import { AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE } from "../lib/error";

export type UseSignUpOutput = (
    username: string,
    password: string,
    validationData?: Record<string, string>,
    attributes?: Record<string, string>
) => Promise<void>;

export const useSignUp = (): UseSignUpOutput => {
    invariant(
        Auth && typeof Auth.signUp === "function",
        AMPLIFY_AUTH_NOT_INSTALLED_ERROR_MESSAGE
    );

    const { handleStateChange } = useContext(AuthDataContext);

    return async (
        username: string,
        password: string,
        validationData?: Record<string, string>,
        attributes?: Record<string, string>
    ): Promise<void> => {
        const validationDataArray: CognitoUserAttribute[] = [];

        if (validationData) {
            for (const [name, value] of Object.entries(validationData)) {
                validationDataArray.push(
                    new CognitoUserAttribute({
                        Name: name,
                        Value: value,
                    })
                );
            }
        }

        const signupInfo = {
            username,
            password,
            attributes,
            validationData: validationDataArray,
        };

        try {
            const data = await Auth.signUp(signupInfo);
            handleStateChange(AuthRoute.ConfirmSignUp, {
                username: data.user.getUsername(),
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
};
