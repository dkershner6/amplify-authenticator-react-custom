import React, { ReactElement, ReactNode } from "react";

import { Auth } from "@aws-amplify/auth";
import { renderHook, waitFor } from "@testing-library/react";
import { mocked } from "jest-mock";

import TestWrapper from "../test/TestWrapper";

import { useConfirmSignIn } from "./useConfirmSignIn";

import { useCheckContact } from ".";

jest.mock("@aws-amplify/auth");
jest.mock("./useCheckContact");

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

describe("useConfirmSignIn", () => {
    const checkContact = jest.fn();
    beforeAll(() => {
        mocked(useCheckContact).mockReturnValue(checkContact);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should call Auth with correct params", async () => {
        const { result } = renderHook(useConfirmSignIn, {
            wrapper: CustomTestWrapper,
        });

        await result.current.confirm(testCode);

        expect(mocked(Auth.confirmSignIn)).toHaveBeenCalledWith(
            testAuthData,
            testCode,
            null,
        );
    });

    it("Should call checkContact with correct params", async () => {
        const { result } = renderHook(useConfirmSignIn, {
            wrapper: CustomTestWrapper,
        });

        await result.current.confirm(testCode);

        await waitFor(() => {
            expect(checkContact).toHaveBeenCalledWith(testAuthData);
        });
    });
});
