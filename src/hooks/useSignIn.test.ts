import { Auth } from "@aws-amplify/auth";
import { renderHook, waitFor } from "@testing-library/react";
import { mocked } from "jest-mock";

import { useCheckContact } from "..";
import TestWrapper from "../test/TestWrapper";

import { useSignIn } from "./useSignIn";

jest.mock("@aws-amplify/auth");
jest.mock("./useCheckContact");

describe("useSignIn", () => {
    const signInResponse = {
        challengeName: "default",
    };
    const checkContact = jest.fn();
    beforeAll(() => {
        mocked(Auth.signIn).mockResolvedValue(signInResponse);
        mocked(useCheckContact).mockReturnValue(checkContact);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const testUsername = "test";
    const testPassword = "P@ssw0rd";

    it("Should call Auth with correct params", async () => {
        const { result } = renderHook(useSignIn, {
            wrapper: TestWrapper,
        });

        await result.current(testUsername, testPassword);

        expect(mocked(Auth.signIn)).toHaveBeenCalledWith({
            username: testUsername,
            password: testPassword,
            validationData: undefined,
        });
    });

    it("Should call checkContact with correct params", async () => {
        const { result } = renderHook(useSignIn, {
            wrapper: TestWrapper,
        });

        await result.current(testUsername, testPassword);

        await waitFor(() => {
            expect(checkContact).toHaveBeenCalledWith(signInResponse);
        });
    });
});
