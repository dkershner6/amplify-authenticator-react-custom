// eslint-disable-next-line import/prefer-default-export
export function isEmptyObject(obj: Record<string, unknown>): boolean {
    return Object.keys(obj).length === 0;
}
