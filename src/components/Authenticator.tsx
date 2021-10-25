import React from "react";

import { AuthDataProvider, AuthProps } from "../context/AuthDataContext";

import { AuthenticatorComponents, AuthRouter } from "./AuthRouter";

export interface AuthenticatorProps {
    authProps?: AuthProps;
    components: AuthenticatorComponents;
}

export const Authenticator: React.FC<AuthenticatorProps> = (props) => {
    const { children, authProps, components } = props;

    return (
        <AuthDataProvider {...authProps}>
            <AuthRouter components={components}>{children}</AuthRouter>
        </AuthDataProvider>
    );
};
