import { useContext } from "react";

import { AuthDataContext, AuthRoute } from "../context/AuthDataContext";

export type UseAuthRouteOutput = (authRoute: AuthRoute) => void;

export const useAuthRoute = (): UseAuthRouteOutput => {
    const { dispatchAuthState } = useContext(AuthDataContext);

    return (authRoute: AuthRoute) => dispatchAuthState({ authRoute });
};
