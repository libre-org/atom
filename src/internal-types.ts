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

/** @ignore */
export type Primitive = undefined | null | boolean | string | number | ((...args: Array<any>) => any);

/** @ignore */
export type Immutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<U>
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<K, V>
  : Readonly<T>;

/** @ignore */
export type DeepImmutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? DeepImmutableArray<U>
  : T extends Map<infer K, infer V>
  ? DeepImmutableMap<K, V>
  : DeepImmutableObject<T>;

/** @ignore */
export interface DeepImmutableArray<T> extends ReadonlyArray<DeepImmutable<T>> {}

/** @ignore */
export interface DeepImmutableMap<K, V> extends ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> {}

/** @ignore */
export type DeepImmutableObject<T> = { readonly [K in keyof T]: DeepImmutable<T[K]> };
