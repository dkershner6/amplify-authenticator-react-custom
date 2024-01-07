import React, { ReactNode, ReactElement } from "react";

import { Auth } from "@aws-amplify/auth";
import { renderHook, waitFor } from "@testing-library/react";
import { mocked } from "jest-mock";

import { useCheckContact } from "..";
import TestWrapper from "../test/TestWrapper";

import { useRequireNewPassword } from "./useRequireNewPassword";

jest.mock("@aws-amplify/auth");
jest.mock("./useCheckContact");

const testAuthData = {
    username: "test",
};
const testPassword = "P@ssw0rd";

const CustomTestWrapper = ({
    children,
}: {
    children: ReactNode;
}): ReactElement => {
    return <TestWrapper authData={testAuthData}>{children}</TestWrapper>;
};

describe("useRequireNewPassword", () => {
    const completeNewPasswordResponse = {
        challengeName: "default",
    };
    const checkContact = jest.fn();

    beforeAll(() => {
        mocked(Auth.completeNewPassword).mockResolvedValue(
            completeNewPasswordResponse,
        );
        mocked(useCheckContact).mockReturnValue(checkContact);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should call Auth with correct params", async () => {
        const { result } = renderHook(useRequireNewPassword, {
            wrapper: CustomTestWrapper,
        });

        await result.current(testPassword);

        expect(mocked(Auth.completeNewPassword)).toHaveBeenCalledWith(
            testAuthData,
            testPassword,
            undefined,
        );
    });

    it("Should call checkContact with correct params", async () => {
        const { result } = renderHook(useRequireNewPassword, {
            wrapper: CustomTestWrapper,
        });

        await result.current(testPassword);

        await waitFor(() => {
            expect(checkContact).toHaveBeenCalledWith(
                completeNewPasswordResponse,
            );
        });
    });
});
