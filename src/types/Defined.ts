/**
 * Removes undefined from union type.
 */
export type Defined<T> = Exclude<T, undefined>;
