import React from "react";

import { AuthRoute, AuthStateContext } from "../context/AuthStateContext";

export const dispatchAuthState = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TestWrapper: React.FC<
    React.PropsWithChildren<{ authRoute?: AuthRoute; authData?: any }>
> = ({ authData, authRoute, children }) => {
    return (
        <AuthStateContext.Provider
            value={{
                authData,
                authRoute: authRoute ?? AuthRoute.SignIn,
                dispatchAuthState,
            }}
        >
            {children}
        </AuthStateContext.Provider>
    );
};

export default TestWrapper;
