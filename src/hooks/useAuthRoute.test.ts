import { renderHook, act } from "@testing-library/react-hooks";

import { AuthRoute, useAuthRoute } from "..";
import TestWrapper, { dispatchAuthState } from "../test/TestWrapper";

describe("useAuthRoute", () => {
    it("Should pass along props to dispatchAuthState", () => {
        const { result, rerender } = renderHook(useAuthRoute, {
            wrapper: TestWrapper,
        });

        const testRoute = AuthRoute.SignUp;
        result.current(testRoute);
        rerender();
        expect(dispatchAuthState).toHaveBeenCalledWith({
            authRoute: testRoute,
        });
    });
});
