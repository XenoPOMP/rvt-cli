/**
 * This type gets type of array.
 *
 * @example
 * ArrayType<string[]> === string
 *
 * ArrayType<(string|number)[]> === string | number
 */
export type ArrayType<T> = T extends Array<infer A> ? A : T;
