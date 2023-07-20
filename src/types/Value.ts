/**
 * Returns value type of Record.
 */
export type Value<T> = T extends Record<any, infer V> ? V : T;
