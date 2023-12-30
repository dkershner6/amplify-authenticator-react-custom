import { renderHook, act } from "@testing-library/react";

import { useAutoRefreshToken } from "./useAutoRefreshToken";
import * as refreshTokenModule from "./useRefreshToken";

const mockRefreshToken = jest.fn();
jest.mock("./useSignedInAuthData", () => ({
    useSignedInAuthData: jest.fn().mockReturnValue({
        accessToken: {
            payload: {
                // About an hour from now
                exp: Date.now() / 1000 + 3600,
            },
        },
    }),
}));

describe("useAutoRefreshToken", () => {
    beforeAll(() => {
        jest.spyOn(refreshTokenModule, "useRefreshToken").mockImplementation(
            () => mockRefreshToken,
        );
    });

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it("Should by default refresh the token 10 minutes before expiry", () => {
        renderHook(useAutoRefreshToken);

        act(() => {
            expect(mockRefreshToken).not.toHaveBeenCalled();

            // About 50 some minutes
            jest.advanceTimersByTime(3100000);

            expect(mockRefreshToken).toHaveBeenCalled();
        });
    });
});
