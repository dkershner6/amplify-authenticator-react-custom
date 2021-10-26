import { Auth } from "@aws-amplify/auth";
import { renderHook } from "@testing-library/react-hooks";
import { mocked } from "ts-jest/utils";

import { AuthRoute } from "..";
import TestWrapper, { dispatchAuthState } from "../test/TestWrapper";

import { useConfirmSignUp } from "./useConfirmSignUp";

jest.mock("@aws-amplify/auth");

describe("useConfirmSignUp", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const testAuthData = {
        username: "test",
    };
    const testCode = "1234";

    it("Should call Auth with correct params", () => {
        const { result } = renderHook(useConfirmSignUp, {
            wrapper: TestWrapper,
            initialProps: { authData: testAuthData },
        });

        result.current.confirm(testCode);

        expect(mocked(Auth.confirmSignUp)).toHaveBeenCalledWith(
            testAuthData.username,
            testCode
        );
    });

    it("Should route to SignedUp", async () => {
        const { result, waitFor } = renderHook(useConfirmSignUp, {
            wrapper: TestWrapper,
            initialProps: { authData: testAuthData },
        });

        result.current.confirm(testCode);

        await waitFor(() => {
            expect(dispatchAuthState).toHaveBeenCalledWith({
                authRoute: AuthRoute.SignedUp,
                authData: null,
            });
        });
    });

    it("Should resend on command", () => {
        const { result } = renderHook(useConfirmSignUp, {
            wrapper: TestWrapper,
            initialProps: { authData: testAuthData },
        });

        result.current.resend();

        expect(mocked(Auth.resendSignUp)).toHaveBeenCalledWith(
            testAuthData.username
        );
    });
});
