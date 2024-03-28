import { Auth } from "@aws-amplify/auth";
import invariant from "tiny-invariant";

export type UseSignOutOutput = (global?: boolean | undefined) => Promise<void>;

export const useSignOut = (global = false): UseSignOutOutput => {
    invariant(
        Auth && typeof Auth.signOut === "function",
        "No Auth module found, please ensure @aws-amplify/auth is imported",
    );

    return async (): Promise<void> => await Auth.signOut({ global });
};
