export const removeNullUndefinedFields = <T extends Record<string, any>>(obj: T): T => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
    ) as T;
}