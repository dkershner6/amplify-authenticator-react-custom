import React, { ReactNode } from "react";

import { AuthDataContext } from "../context/AuthDataContext";
import { AuthProps, useAuth } from "../hooks/useAuth";

import { AuthenticatorComponents, AuthRouter } from "./AuthRouter";

export interface AuthenticatorProps {
    authProps?: AuthProps;
    components: AuthenticatorComponents;
}

export const Authenticator: React.FC<AuthenticatorProps> = (props) => {
    const { children, authProps, components } = props;

    const authContextProviderProps = useAuth(authProps ?? {});

    return (
        <AuthDataContext.Provider value={authContextProviderProps}>
            <AuthRouter components={components}>{children}</AuthRouter>
        </AuthDataContext.Provider>
    );
};
