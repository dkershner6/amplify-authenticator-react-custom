import { useContext } from "react";

import { AuthStateContext } from "..";

export interface AuthDataAttributes {
    email: string;
    /** string of true or false */
    email_verified?: string | null;
    /** End-User's preferred telephone number. E.164 [E.164] is RECOMMENDED as the format of this Claim, for example, +1 (425) 555-1212 or +56 (2) 687 2400. If the phone number contains an extension, it is RECOMMENDED that the extension be represented using the RFC 3966 [RFC3966] extension syntax, for example, +1 (604) 555-1234;ext=5678. */
    phone_number?: string | null;
    /** string of true or false */
    phone_number_verified?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    nickname?: string | null;
    /** URL of the End-User's profile picture. This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image. Note that this URL SHOULD specifically reference a profile photo of the End-User suitable for displaying when describing the End-User, rather than an arbitrary photo taken by the End-User. */
    picture?: string | null;
    /** URL of the End-User's profile page. The contents of this Web page SHOULD be about the End-User. */
    profile?: string | null;
    /** Timezone - String from zoneinfo time zone database representing the End-User's time zone. For example, Europe/Paris or America/Los_Angeles. */
    zoneinfo?: string | null;
    /** End-User's birthday, represented as an ISO 8601:2004 YYYY-MM-DD format. The year MAY be 0000, indicating that it is omitted. To represent only the year, YYYY format is allowed. Note that depending on the underlying platform's date related function, providing just year can result in varying month and day, so the implementers need to take this factor into account to correctly process the dates. */
    birthdate?: string | null;
    /** String representing the User's locale, i.e. 'en-us' */
    locale?: string | null;
    gender?: string | null;
    /** URL of the End-User's Web page or blog. This Web page SHOULD contain information published by the End-User or an organization that the End-User is affiliated with. */
    website?: string | null;
    /**
     * THIS FIELD IS A STRING
     * The Address Claim represents a physical mailing address. Implementations MAY return only a subset of the fields of an address, depending upon the information available and the End-User's privacy preferences. For example, the country and region might be returned without returning more fine-grained address information.
     *
     * Implementations MAY return just the full address as a single string in the formatted sub-field, or they MAY return just the individual component fields using the other sub-fields, or they MAY return both. If both variants are returned, they SHOULD be describing the same address, with the formatted address indicating how the component fields are combined.
     *
     * The shape of this string is a stringified JSON object that looks like below:
     * {
     *    //Full mailing address, formatted for display or use on a mailing label. This field MAY contain multiple lines, separated by newlines. Newlines can be represented either as a carriage return/line feed pair ("\r\n") or as a single line feed character ("\n").
     *    formatted?: string;
     *    //Full street address component, which MAY include house number, street name, Post Office Box, and multi-line extended street address information. This field MAY contain multiple lines, separated by newlines. Newlines can be represented either as a carriage return/line feed pair ("\r\n") or as a single line feed character ("\n").
     *    streetAddress?: string;
     *    //City or locality component.
     *    locality?: string;
     *    //State, province, prefecture, or region component.
     *    region?: string;
     *    //Zip code or postal code component.
     *    postalCode?: string;
     *    //Country name component.
     *    country?: string;
     * }
     */
    address?: string | null;
}

export interface AuthTokenPayload {
    auth_time: number;
    client_id: string;
    "cognito:groups": string[];
    event_id: string;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    origin_jti: string;
    scope: string;
    sub: string;
    token_use: "access" | "id";
    username: string;
}

export interface SignedInUserSession {
    accessToken: {
        jwtToken: string;
        payload: AuthTokenPayload;
        clockDrift: number;
    };
    idToken: {
        jwtToken: string;
        payload: AuthTokenPayload &
            AuthDataAttributes & { "cognito:username": string };
        clockDrift: number;
    };
    refreshToken: {
        token: string;
    };
}

export interface SignedInAuthData {
    username: string;
    attributes: AuthDataAttributes;
    authenticationFlowType: string;
    signInUserSession: SignedInUserSession;
}

export interface UseSignedInAuthDataOutput extends SignedInUserSession {
    authData: SignedInAuthData;
}

export const useSignedInAuthData = (): UseSignedInAuthDataOutput => {
    const { authData } = useContext(AuthStateContext);

    const castAuthData = authData as SignedInAuthData;

    return { authData: castAuthData, ...castAuthData?.signInUserSession };
};
