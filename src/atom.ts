import * as ErrorMsgs from "./error-messages";
import { DeepImmutable } from "./internal-types";
// ------------------------------------------------------------------------------------------ //
// ---------------------------------- INTERNAL STATE ---------------------------------------- //
// ------------------------------------------------------------------------------------------ //

let nextAtomUid = 0;

const stateByAtomId: Record<number, DeepImmutable<any>> = Object.create(null);

/** @ignore */
export function getState<S>(atom: Atom<S>): DeepImmutable<S> {
  return stateByAtomId[atom["$$id"]];
}

// ------------------------------------------------------------------------------------------ //
// -------------------------------------- PUBLIC API ---------------------------------------- //
// ------------------------------------------------------------------------------------------ //

/**
 * `@libre/atom` provides a data type called `Atom` and a few functions for working with `Atom`s.
 * It is heavily inspired by `atom`s in Clojure(Script).
 *
 * Atoms provide a predictable way to manage state that is shared by multiple components of a
 * program as that state changes over time. They are particularly useful in the functional and reactive
 * programming paradigms, where most components of a program are pure functions operating on
 * immutable data. In this context, Atoms provide a form of mutability that is controlled in such
 * a way that no component can mutate another component's current reference to the state in
 * the middle of some process or asynchronous operation.
 *
 */

//
// ======================================= ATOM ==============================================
//

export class Atom<S = any> {
  /**
   * Constructs a new instance of [[Atom]] with its internal state
   * set to `state`.
   *
   * @param S the type of the value being set as an [[Atom]]'s internal state
   * @example
```js

import { Atom } from '@libre/atom'

const a1 = Atom.of(0)
const a2 = Atom.of("zero")
const a3 = Atom.of({ count: 0 })
```
   */
  public static of<S>(state: S): Atom<S> {
    return new Atom(state);
  }

  /** @ignore */
  public readonly ["$$id"]: number;

  /** @ignore */
  private constructor(state: S) {
    Object.defineProperty(this, "$$id", { value: nextAtomUid++ });
    stateByAtomId[this["$$id"]] = state;
    return this;
  }
  /** @ignore */
  public toString(): string {
    return `Atom ${JSON.stringify(
      {
        $$id: this["$$id"],
        "[[__state__]]": getState(this)
      },
      null,
      "  "
    )}`;
  }
  /** @ignore */
  public inspect(): string {
    return this.toString();
  }
}
//
// ======================================= DEREF ==============================================
//

/**
 * Reads (i.e. "*dereferences*") the current state of an [[Atom]]. The dereferenced value
 * should ___not___ be mutated.
 *
 * @param <S> the type of `atom`'s inner state
 *
 * @example
```js

import {Atom, deref} from '@libre/atom'

const stateAtom = Atom.of({ count: 0 })

deref(stateAtom) // => { count: 0 }
```
 */
export function deref<S>(atom: Atom<S>): DeepImmutable<S> {
  if (!(atom instanceof Atom)) {
    const arg = JSON.stringify(atom, null, "  ");
    throw TypeError(`${ErrorMsgs.derefArgMustBeAtom}\n${arg}`);
  }

  return getState(atom);
}

//
// ======================================= SWAP ==============================================
//
/**
 * Swaps `atom`'s state with the value returned from applying `updateFn` to `atom`'s
 * current state. `updateFn` should be a pure function and ___not___ mutate `state`.
 *
 * @param atom an instance of [[Atom]]
 * @param updateFn a pure function that takes the current state and returns the next state; the next state should be of the same type/interface as the current state;
 *
 * @example
 * ```jsx
 *
 *import {Atom, swap} from '@libre/atom'
 *
 *const stateAtom = Atom.of({ count: 0 })
 *const increment = () => swap(stateAtom, (state) => ({
 *  count: state.count + 1
 *}));
 * ```
 */
export function swap<S>(atom: Atom<S>, updateFn: (state: DeepImmutable<S>) => S): void {
  stateByAtomId[atom["$$id"]] = updateFn(getState(atom));
}

//
// ======================================= SET ==============================================
//

/**
 * Sets `atom`s state to `nextState`.
 *
 * It is equivalent to `swap(atom, () => newState)`.
 *
 * @param atom an instance of [[Atom]]
 * @param nextState the value to which to set the state; it should be the same type/interface as current state
 *
  * @example
```js

import {Atom, useAtom, set} from '@libre/atom'
import { DeepImmutable } from './internal-types';

const atom = Atom.of({ count: 0 })

set(atom, { count: 100 })
deref(atom) // => { count: 100 }
```
 */

export function set<S>(atom: Atom<S>, nextState: S): void {
  swap(atom, () => nextState);
}
