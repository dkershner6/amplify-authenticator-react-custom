import React, { ReactElement, ReactNode } from "react";

import { Auth } from "@aws-amplify/auth";
import { renderHook, waitFor } from "@testing-library/react";
import { mocked } from "jest-mock";

import { AuthRoute } from "..";
import TestWrapper, { dispatchAuthState } from "../test/TestWrapper";

import { useConfirmSignUp } from "./useConfirmSignUp";

jest.mock("@aws-amplify/auth");

const testAuthData = {
    username: "test",
};
const testCode = "1234";

const CustomTestWrapper = ({
    children,
}: {
    children: ReactNode;
}): ReactElement => {
    return <TestWrapper authData={testAuthData}>{children}</TestWrapper>;
};

describe("useConfirmSignUp", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should call Auth with correct params", async () => {
        const { result } = renderHook(useConfirmSignUp, {
            wrapper: CustomTestWrapper,
        });

        await result.current.confirm(testCode);

        expect(mocked(Auth.confirmSignUp)).toHaveBeenCalledWith(
            testAuthData.username,
            testCode,
        );
    });

    it("Should route to SignedUp", async () => {
        const { result } = renderHook(useConfirmSignUp, {
            wrapper: CustomTestWrapper,
        });

        await result.current.confirm(testCode);

        await waitFor(() => {
            expect(dispatchAuthState).toHaveBeenCalledWith({
                authRoute: AuthRoute.SignedUp,
                authData: null,
            });
        });
    });

    it("Should resend on command", async () => {
        const { result } = renderHook(useConfirmSignUp, {
            wrapper: CustomTestWrapper,
        });

        await result.current.resend();

        expect(mocked(Auth.resendSignUp)).toHaveBeenCalledWith(
            testAuthData.username,
        );
    });
});
