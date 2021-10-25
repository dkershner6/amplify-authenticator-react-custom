import { useEffect } from "react";

import { useRefreshToken } from "./useRefreshToken";

import { useSignedInAuthData } from ".";

export interface UseAuthRefreshTokenOptions {
    /** Set to -1 to disable */
    timeBeforeExpiryToResetInMs?: number;
}

export const useAutoRefreshToken = (
    options?: UseAuthRefreshTokenOptions
): void => {
    const { timeBeforeExpiryToResetInMs = 600000 } = options ?? {};

    const { accessToken } = useSignedInAuthData();
    const refreshTokenManually = useRefreshToken();

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            timeBeforeExpiryToResetInMs !== -1
        ) {
            let refreshTokenTimer: number;
            if (accessToken?.payload?.exp) {
                const expiresAtInEpochMs = accessToken.payload.exp * 1000;
                const nowInEpochMs = Date.now();

                const msUntilRefreshTime =
                    expiresAtInEpochMs -
                    timeBeforeExpiryToResetInMs -
                    nowInEpochMs;

                console.debug(
                    `Auth - Setting timer to refresh token in ${
                        msUntilRefreshTime / 1000 / 60
                    } minutes`
                );
                refreshTokenTimer = window.setTimeout(
                    () => refreshTokenManually(),
                    msUntilRefreshTime
                );
            }

            return () => {
                if (refreshTokenTimer) {
                    window.clearTimeout(refreshTokenTimer);
                }
            };
        }
    }, [accessToken, refreshTokenManually, timeBeforeExpiryToResetInMs]);
};
