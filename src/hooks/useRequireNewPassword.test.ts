import { Auth } from "@aws-amplify/auth";
import { renderHook } from "@testing-library/react-hooks";
import { mocked } from "ts-jest/utils";

import { useCheckContact } from "..";
import TestWrapper from "../test/TestWrapper";

import { useRequireNewPassword } from "./useRequireNewPassword";

jest.mock("@aws-amplify/auth");
jest.mock("./useCheckContact");

describe("useRequireNewPassword", () => {
    const completeNewPasswordResponse = {
        challengeName: "default",
    };
    beforeAll(() => {
        mocked(Auth.completeNewPassword).mockResolvedValue(
            completeNewPasswordResponse
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const testAuthData = {
        username: "test",
    };
    const testPassword = "P@ssw0rd";

    it("Should call Auth with correct params", () => {
        const { result } = renderHook(useRequireNewPassword, {
            wrapper: TestWrapper,
            initialProps: { authData: testAuthData },
        });

        result.current(testPassword);

        expect(mocked(Auth.completeNewPassword)).toHaveBeenCalledWith(
            testAuthData,
            testPassword,
            undefined
        );
    });

    it("Should call checkContact with correct params", async () => {
        const checkContact = jest.fn();
        mocked(useCheckContact).mockReturnValue(checkContact);

        const { result, waitFor } = renderHook(useRequireNewPassword, {
            wrapper: TestWrapper,
            initialProps: { authData: testAuthData },
        });

        result.current(testPassword);

        await waitFor(() => {
            expect(checkContact).toHaveBeenCalledWith(
                completeNewPasswordResponse
            );
        });
    });
});
