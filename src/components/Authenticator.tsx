/* istanbul ignore file */

import React from "react";

import { AuthenticatorComponents, AuthRouter } from "./AuthRouter";
import { useAutoRefreshToken } from "..";
import { AuthStateProvider, AuthProps } from "../context/AuthStateContext";

export interface AuthenticatorProps {
    authProps?: AuthProps;
    components: AuthenticatorComponents;
    /** Set to -1 to disable */
    timeBeforeExpiryToResetInMs?: number;
}

export const Authenticator: React.FC<
    React.PropsWithChildren<AuthenticatorProps>
> = (props) => {
    const { children, authProps, ...otherProps } = props;

    return (
        <AuthStateProvider {...authProps}>
            <AuthenticatorContent {...otherProps}>
                {children}
            </AuthenticatorContent>
        </AuthStateProvider>
    );
};

export const AuthenticatorContent: React.FC<
    React.PropsWithChildren<{
        components: AuthenticatorComponents;
        timeBeforeExpiryToResetInMs?: number;
    }>
> = ({ children, components, timeBeforeExpiryToResetInMs }) => {
    useAutoRefreshToken({ timeBeforeExpiryToResetInMs });

    return <AuthRouter components={components}>{children}</AuthRouter>;
};
