import { renderHook } from "@testing-library/react";

import { AuthRoute, useAuthRoute } from "..";
import TestWrapper, { dispatchAuthState } from "../test/TestWrapper";

describe("useAuthRoute", () => {
    it("Should pass along props to dispatchAuthState", () => {
        const { result } = renderHook(useAuthRoute, {
            wrapper: TestWrapper,
        });

        const testRoute = AuthRoute.SignUp;
        result.current(testRoute);

        expect(dispatchAuthState).toHaveBeenCalledWith({
            authRoute: testRoute,
        });
    });
});
