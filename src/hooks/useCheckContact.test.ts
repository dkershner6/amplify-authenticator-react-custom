import { Auth } from "@aws-amplify/auth";
import { renderHook } from "@testing-library/react-hooks";
import { mocked } from "ts-jest/utils";

import { AuthRoute } from "..";
import TestWrapper, { dispatchAuthState } from "../test/TestWrapper";

import { useCheckContact } from ".";

jest.mock("@aws-amplify/auth");

describe("useCheckContact", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const testAuthData = {
        username: "test",
    };

    it("Should call Auth with correct params", () => {
        mocked(Auth.verifiedContact).mockResolvedValue({
            verified: {},
            unverified: {},
        });
        const { result } = renderHook(useCheckContact, {
            wrapper: TestWrapper,
        });

        result.current(testAuthData);

        expect(mocked(Auth.verifiedContact)).toHaveBeenCalledWith(testAuthData);
    });

    it("Should route to VerifyContact if verified is empty", async () => {
        mocked(Auth.verifiedContact).mockResolvedValue({
            verified: {},
            unverified: {},
        });
        const { result, waitFor } = renderHook(useCheckContact, {
            wrapper: TestWrapper,
        });

        result.current(testAuthData);

        await waitFor(() => {
            expect(dispatchAuthState).toHaveBeenCalledWith({
                authRoute: AuthRoute.VerifyContact,
                authData: expect.objectContaining(testAuthData),
            });
        });
    });

    it("Should route to SignedIn if verified is NOT empty", async () => {
        mocked(Auth.verifiedContact).mockResolvedValue({
            verified: {
                howIsWe: "weAllGood",
            },
            unverified: {},
        });
        const { result, waitFor } = renderHook(useCheckContact, {
            wrapper: TestWrapper,
        });

        result.current(testAuthData);

        await waitFor(() => {
            expect(dispatchAuthState).toHaveBeenCalledWith({
                authRoute: AuthRoute.SignedIn,
                authData: expect.objectContaining(testAuthData),
            });
        });
    });
});
