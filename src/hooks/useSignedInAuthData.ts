import { useContext } from "react";

import { AuthStateContext } from "..";

export interface SignedInAuthData {
    username: string;
    attributes: {
        email: string;
        phone: string;
        sub: string;
    };
    signInUserSession: unknown;
}

export const useSignedInAuthData = (): SignedInAuthData => {
    const { authData } = useContext(AuthStateContext);

    return authData as SignedInAuthData;
};
