import * as ErrorMsgs from "./error-messages";
// ------------------------------------------------------------------------------------------ //
// ---------------------------------- INTERNAL STATE ---------------------------------------- //
// ------------------------------------------------------------------------------------------ //

let nextAtomUid = 0;

const stateByAtomId: Record<number, unknown> = Object.create(null);

/** @ignore */
export function getState<S>(atom: Atom<S>): S {
  return stateByAtomId[atom["$$id"]] as S;
}

// ------------------------------------------------------------------------------------------ //
// -------------------------------------- PUBLIC API ---------------------------------------- //
// ------------------------------------------------------------------------------------------ //

/**
 * `@libre/atom` provides a data type called `Atom` and a few functions for working with `Atom`s.
 * It is heavily inspired by `atom`s in Clojure.
 *
 * Atoms provide a predictable way to manage state that is shared by multiple components of a
 * program as it changes over time. They are particularly useful in the functional and reactive
 * programming paradigms, where most components of a program are pure functions operating on
 * immutable data. In this context, Atoms provide a form of mutability that is controlled in such
 * a way that no component can mutate another component's current reference to the state in
 * the middle of some process or asynchronous operation.
 *
 */

//
// ======================================= ATOM ==============================================
//

export class Atom<S = unknown> {
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
  public static of<S>(state: S) {
    return new Atom(state);
  }

  /** @ignore */
  public readonly ["$$id"]: number;

  /** @ignore */
  private constructor(state: S) {
    this["$$id"] = nextAtomUid++;
    stateByAtomId[this["$$id"]] = state;
    Object.freeze(this);
  }
  /** @ignore */
  public toString(): string {
    return `Atom ${JSON.stringify(
      {
        $$id: this["$$id"],
        "[[inner_state]]": getState(this)
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
 * Reads the current state of an [[Atom]]
 *
 * @param S the internal state of the [[Atom]] passed to [[deref]]
 *
 * @example
```js

import {Atom, deref} from '@libre/atom'

const stateAtom = Atom.of({ count: 0 })

deref(stateAtom) // => { count: 0 }
```
 */
export function deref<S>(atom: Atom<S>) {
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
 * current state.
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
export function swap<S>(atom: Atom<S>, updateFn: (state: S) => S): void {
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

const atom = Atom.of({ count: 0 })

set(atom, { count: 100 })
deref(atom) // => { count: 100 }
```
 */

export function set<S>(atom: Atom<S>, nextState: S): void {
  swap(atom, () => nextState);
}
