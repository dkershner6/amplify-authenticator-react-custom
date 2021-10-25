import React, { ReactNode, useContext } from "react";

import { AuthStateContext, AuthRoute } from "../context/AuthStateContext";

export interface AuthenticatorComponents {
    confirmSignIn?: ReactNode;
    confirmSignUp?: ReactNode;
    forgotPassword?: ReactNode;
    signIn?: ReactNode;
    signUp?: ReactNode;
    requireNewPassword?: ReactNode;
    totpSetup?: ReactNode;
    verifyContact?: ReactNode;
}

export const AuthRouter: React.FC<{ components: AuthenticatorComponents }> = ({
    children,
    components,
}) => {
    const { authRoute } = useContext(AuthStateContext);

    switch (authRoute) {
        case AuthRoute.ConfirmSignIn:
            return <>{components.confirmSignIn}</>;
        case AuthRoute.ConfirmSignUp:
            return <>{components.confirmSignUp}</>;
        case AuthRoute.ForgotPassword:
            return <>{components.forgotPassword}</>;
        case AuthRoute.RequireNewPassword:
            return <>{components.requireNewPassword}</>;
        case AuthRoute.SignIn:
        case AuthRoute.SignedOut:
        case AuthRoute.SignedUp:
        default:
            return <>{components.signIn}</>;
        case AuthRoute.SignUp:
            return <>{components.signUp}</>;
        case AuthRoute.SignedIn:
            return <>{children}</>;
        case AuthRoute.TOTPSetup:
            return <>{components.totpSetup}</>;
        case AuthRoute.VerifyContact:
            return <>{components.verifyContact}</>;
    }
};
