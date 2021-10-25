import { useContext } from "react";

import { AuthDataContext } from "..";

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
    const { authData } = useContext(AuthDataContext);

    return authData as SignedInAuthData;
};
