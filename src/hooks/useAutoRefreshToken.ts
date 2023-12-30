import { useEffect } from "react";

import { useSignedInAuthData } from ".";
import { useRefreshToken } from "./useRefreshToken";

export interface UseAuthRefreshTokenOptions {
    /** Set to -1 to disable */
    timeBeforeExpiryToResetInMs?: number;
}

export const useAutoRefreshToken = (
    options?: UseAuthRefreshTokenOptions,
): void => {
    const { timeBeforeExpiryToResetInMs = 600000 } = options ?? {};

    const { accessToken } = useSignedInAuthData();
    const refreshTokenManually = useRefreshToken();

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            timeBeforeExpiryToResetInMs > 0 &&
            accessToken?.payload?.exp
        ) {
            const expiresAtInEpochMs = accessToken.payload.exp * 1000;
            const nowInEpochMs = Date.now();

            const msUntilRefreshTime = Math.max(
                expiresAtInEpochMs - timeBeforeExpiryToResetInMs - nowInEpochMs,
                0,
            );

            if (msUntilRefreshTime > 0) {
                console.debug(
                    `Auth - Setting timer to refresh token in ${
                        Math.round((msUntilRefreshTime / 1000 / 60) * 100) / 100
                    } minutes`,
                );
                const refreshTokenTimer = window.setTimeout(
                    () => refreshTokenManually(),
                    msUntilRefreshTime,
                );

                return () => {
                    if (refreshTokenTimer) {
                        window.clearTimeout(refreshTokenTimer);
                    }
                };
            }

            void refreshTokenManually();
        }

        return;
    }, [accessToken, refreshTokenManually, timeBeforeExpiryToResetInMs]);
};
