import React, { ReactElement, useContext } from "react";

import { Auth } from "@aws-amplify/auth";
import { render, waitFor } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import { AuthStateProvider } from "./AuthStateContext";

import { AuthRoute, AuthStateContext } from ".";

jest.mock("@aws-amplify/auth");

describe("AuthStateContext", () => {
    const TestComponent = (): ReactElement => {
        const { authRoute } = useContext(AuthStateContext);

        return (
            <div>
                <p data-testid="authRoute">{authRoute}</p>
            </div>
        );
    };

    it("Should set authRoute to signIn if no user is present", async () => {
        mocked(Auth.currentAuthenticatedUser).mockRejectedValue(
            "No user throws an error"
        );
        const { getByText } = render(
            <AuthStateProvider>
                <TestComponent />
            </AuthStateProvider>
        );

        await waitFor(() => {
            expect(getByText(AuthRoute.SignIn)).toBeInTheDocument();
        });
    });

    it("Should change authRoute to signedIn if a user is present", async () => {
        mocked(Auth.currentAuthenticatedUser).mockResolvedValue("user");

        const { getByText } = render(
            <AuthStateProvider>
                <TestComponent />
            </AuthStateProvider>
        );

        await waitFor(() => {
            expect(getByText(AuthRoute.SignedIn)).toBeInTheDocument();
        });
    });
});
