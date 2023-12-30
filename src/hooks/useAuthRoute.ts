import { useContext } from "react";

import { AuthStateContext, AuthRoute } from "../context/AuthStateContext";

export type UseAuthRouteOutput = (authRoute: AuthRoute) => void;

export const useAuthRoute = (): UseAuthRouteOutput => {
    const { dispatchAuthState } = useContext(AuthStateContext);

    return (authRoute: AuthRoute) => dispatchAuthState({ authRoute });
};
