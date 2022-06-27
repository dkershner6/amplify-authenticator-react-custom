import { Auth } from "@aws-amplify/auth";
import { renderHook, waitFor } from "@testing-library/react";
import { mocked } from "jest-mock";

import { AuthRoute } from "..";
import TestWrapper, { dispatchAuthState } from "../test/TestWrapper";

import { useSignUp } from "./useSignUp";

jest.mock("@aws-amplify/auth");

describe("useSignUp", () => {
    const testUsername = "test";

    const signInResponse = {
        user: {
            getUsername: () => testUsername,
        },
    };

    beforeAll(() => {
        // @ts-expect-error - incomplete mock
        mocked(Auth.signUp).mockResolvedValue(signInResponse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const testPassword = "P@ssw0rd";

    it("Should call Auth with correct params", () => {
        const { result } = renderHook(useSignUp, {
            wrapper: TestWrapper,
        });

        result.current(testUsername, testPassword);

        expect(mocked(Auth.signUp)).toHaveBeenCalledWith(
            expect.objectContaining({
                username: testUsername,
                password: testPassword,
            })
        );
    });

    it("Should route to ConfirmSignUp", async () => {
        const { result } = renderHook(useSignUp, {
            wrapper: TestWrapper,
        });

        result.current(testUsername, testPassword);

        await waitFor(() => {
            expect(dispatchAuthState).toHaveBeenCalledWith({
                authRoute: AuthRoute.ConfirmSignUp,
                authData: {
                    username: testUsername,
                },
            });
        });
    });
});
