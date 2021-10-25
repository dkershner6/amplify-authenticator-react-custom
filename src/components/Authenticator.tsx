import React from "react";

import { AuthStateProvider, AuthProps } from "../context/AuthStateContext";

import { AuthenticatorComponents, AuthRouter } from "./AuthRouter";

export interface AuthenticatorProps {
    authProps?: AuthProps;
    components: AuthenticatorComponents;
}

export const Authenticator: React.FC<AuthenticatorProps> = (props) => {
    const { children, authProps, components } = props;

    return (
        <AuthStateProvider {...authProps}>
            <AuthRouter components={components}>{children}</AuthRouter>
        </AuthStateProvider>
    );
};
