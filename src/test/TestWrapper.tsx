import React from "react";

import { AuthRoute, AuthStateContext } from "../context/AuthStateContext";

export const dispatchAuthState = jest.fn();

const TestWrapper: React.FC<{ authRoute?: AuthRoute }> = ({
    authRoute,
    children,
}) => {
    return (
        <AuthStateContext.Provider
            value={{
                authRoute: authRoute ?? AuthRoute.SignIn,
                dispatchAuthState,
            }}
        >
            {children}
        </AuthStateContext.Provider>
    );
};

export default TestWrapper;
