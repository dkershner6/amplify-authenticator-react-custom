import React from "react";

import { useAutoRefreshToken } from "..";
import { AuthStateProvider, AuthProps } from "../context/AuthStateContext";

import { AuthenticatorComponents, AuthRouter } from "./AuthRouter";

export interface AuthenticatorProps {
    authProps?: AuthProps;
    components: AuthenticatorComponents;
    /** Set to -1 to disable */
    timeBeforeExpiryToResetInMs?: number;
}

export const Authenticator: React.FC<AuthenticatorProps> = (props) => {
    const { children, authProps, ...otherProps } = props;

    return (
        <AuthStateProvider {...authProps}>
            <AuthenticatorContent {...otherProps}>
                {children}
            </AuthenticatorContent>
        </AuthStateProvider>
    );
};

export const AuthenticatorContent: React.FC<{
    components: AuthenticatorComponents;
    timeBeforeExpiryToResetInMs?: number;
}> = ({ children, components, timeBeforeExpiryToResetInMs }) => {
    useAutoRefreshToken({ timeBeforeExpiryToResetInMs });

    return <AuthRouter components={components}>{children}</AuthRouter>;
};
