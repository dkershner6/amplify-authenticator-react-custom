import { Auth } from "@aws-amplify/auth";
import { renderHook } from "@testing-library/react-hooks";
import { mocked } from "ts-jest/utils";

import TestWrapper from "../test/TestWrapper";

import { useConfirmSignIn } from "./useConfirmSignIn";

import { useCheckContact } from ".";

jest.mock("@aws-amplify/auth");
jest.mock("./useCheckContact");

describe("useConfirmSignIn", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const testAuthData = {
        username: "test",
    };
    const testCode = "1234";

    it("Should call Auth with correct params", () => {
        const { result } = renderHook(useConfirmSignIn, {
            wrapper: TestWrapper,
            initialProps: { authData: testAuthData },
        });

        result.current.confirm(testCode);

        expect(mocked(Auth.confirmSignIn)).toHaveBeenCalledWith(
            testAuthData,
            testCode,
            null
        );
    });

    it("Should call checkContact with correct params", async () => {
        const checkContact = jest.fn();
        mocked(useCheckContact).mockReturnValue(checkContact);

        const { result, waitFor } = renderHook(useConfirmSignIn, {
            wrapper: TestWrapper,
            initialProps: { authData: testAuthData },
        });

        result.current.confirm(testCode);

        await waitFor(() => {
            expect(checkContact).toHaveBeenCalledWith(testAuthData);
        });
    });
});
