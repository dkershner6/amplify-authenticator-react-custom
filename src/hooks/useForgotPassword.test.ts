import { Auth } from "@aws-amplify/auth";
import { renderHook, act, waitFor } from "@testing-library/react";
import { mocked } from "jest-mock";

import { useForgotPassword } from "./useForgotPassword";
import { AuthRoute } from "..";
import TestWrapper, { dispatchAuthState } from "../test/TestWrapper";

jest.mock("@aws-amplify/auth");

describe("useForgotPassword", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const testUsername = "testUser";
    const testCode = "1234";
    const testPassword = "P@ssw0rd";

    it("Should call Auth with correct params for send", async () => {
        const { result } = renderHook(useForgotPassword, {
            wrapper: TestWrapper,
        });

        await act(() => result.current.send(testUsername));

        expect(mocked(Auth.forgotPassword)).toHaveBeenCalledWith(testUsername);
    });

    it("Should populate username on send", async () => {
        const { result } = renderHook(useForgotPassword, {
            wrapper: TestWrapper,
        });

        await act(() => result.current.send(testUsername));

        await waitFor(() => {
            expect(result.current.username).toEqual(testUsername);
        });
    });

    it("Should call Auth with correct params on submit", async () => {
        const { result } = renderHook(useForgotPassword, {
            wrapper: TestWrapper,
        });

        await act(() => result.current.send(testUsername));

        await act(() => result.current.submit(testCode, testPassword));

        expect(mocked(Auth.forgotPasswordSubmit)).toHaveBeenCalledWith(
            testUsername,
            testCode,
            testPassword,
        );
    });

    it("Should route to SignIn when complete", async () => {
        const { result } = renderHook(useForgotPassword, {
            wrapper: TestWrapper,
        });

        await act(() => result.current.send(testUsername));

        await act(() => result.current.submit(testCode, testPassword));

        expect(dispatchAuthState).toHaveBeenCalledWith({
            authRoute: AuthRoute.SignIn,
            authData: null,
        });
    });
});
