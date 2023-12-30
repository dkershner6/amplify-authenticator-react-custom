import { isEmptyObject } from "./utils";

describe("isEmptyObject", () => {
    it("Should detect an empty object", () => {
        expect(isEmptyObject({})).toBeTruthy();
    });

    it("Should not detect an unempty object", () => {
        expect(isEmptyObject({ isEmpty: "nope" })).toBeFalsy();
    });
});
