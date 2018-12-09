import { Atom } from "./atom";

/**
 * Extracts the type info of an [[Atom]]'s inner state
 *
 * @param <A> an [[Atom]]'s type
 *
 * @example
 * ```ts
 *
 * const state = Atom.of({count: 0});
 * const increment = (s: AtomState<typeof state>) => ({ count: s.count + 1 })
 * swap(state, increment);
 * ```
 */
export type AtomState<A extends Atom<any>> = A extends Atom<infer S> ? S : never;
