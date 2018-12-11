import * as ErrorMsgs from "./error-messages";
import { AtomConstructorOptions, DeepImmutable } from "./internal-types";
import { prettyPrint, throwIfNotAtom } from "./utils";
// ------------------------------------------------------------------------------------------ //
// ---------------------------------- INTERNAL STATE ---------------------------------------- //
// ------------------------------------------------------------------------------------------ //

let nextAtomUid = 0;

const stateByAtomId: Record<number, DeepImmutable<any>> = Object.create(null);
const validatorByAtomId: Record<number, NonNullable<AtomConstructorOptions<any>["validator"]>> = Object.create(null);

/** @ignore */
export function getState<S>(atom: Atom<S>): DeepImmutable<S> {
  return stateByAtomId[atom["$$id"]];
}

// ------------------------------------------------------------------------------------------ //
// -------------------------------------- PUBLIC API ---------------------------------------- //
// ------------------------------------------------------------------------------------------ //

/**
 * A data structure useful for providing a controlled, predictable mechanism for mutability.
 * Allows multiple components of a program to share read/write access to some state in such
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
  public static of<S>(state: S, options?: AtomConstructorOptions<S>): Atom<S> {
    return new Atom(state, options);
  }

  /** @ignore */
  public readonly ["$$id"]: number;

  /** @ignore */
  private constructor(state: S, { validator }: AtomConstructorOptions<S> = {}) {
    validator = validator || (() => true);
    if (!validator(state as DeepImmutable<S>)) {
      const errMsg = `Atom initialized with invalid state:\n\n${prettyPrint(
        state
      )}\n\naccording to validator function:\n${validator}\n\n`;
      const err = Error(errMsg);
      err.name = "AtomInvalidStateError";

      throw err;
    }
    Object.defineProperty(this, "$$id", { value: nextAtomUid++ });
    stateByAtomId[this["$$id"]] = state;
    validatorByAtomId[this["$$id"]] = validator;
    return this;
  }
  /** @ignore */
  public toString(): string {
    return `Atom<${prettyPrint(getState(this))}>`;
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
 * Dereferences (i.e. "*reads*") the current state of an [[Atom]]. The dereferenced value
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
  throwIfNotAtom(atom);
  return getState(atom);
}

//
// ======================================= SWAP ==============================================
//
/**
 * Swaps `atom`'s state with the value returned from applying `updateFn` to `atom`'s
 * current state. `updateFn` should be a pure function and ___not___ mutate `state`.
 *
 * @param <S> the type of `atom`'s inner state
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
  throwIfNotAtom(atom);
  const nextState = updateFn(getState(atom));
  const validator = getValidator(atom);
  const didValidate = validator(nextState);
  if (!didValidate) {
    const errMsg = `swap updateFn\n${updateFn}\n\nattempted to swap the state of\n\n${atom}\n\nwith:\n\n${prettyPrint(
      nextState
    )}\n\nbut it did not pass validator:\n${validator}\n\n`;
    const err = Error(errMsg);
    err.name = "AtomInvalidStateError";

    throw err;
  } else {
    stateByAtomId[atom["$$id"]] = nextState;
  }
}

//
// ======================================= SET ==============================================
//

/**
 * Sets `atom`s state to `nextState`.
 *
 * It is equivalent to `swap(atom, () => newState)`.
 *
 * @param <S> the type of `atom`'s inner state
 * @param atom an instance of [[Atom]]
 * @param nextState the value to which to set the state; it should be the same type/interface as current state
 *
  * @example
```js

import {Atom, deref, set} from '@libre/atom'

const atom = Atom.of({ count: 0 })

set(atom, { count: 100 })
deref(atom) // => { count: 100 }
```
 */

export function set<S>(atom: Atom<S>, nextState: S): void {
  throwIfNotAtom(atom);
  const validator = getValidator(atom);
  const didValidate = validator(nextState);
  if (!didValidate) {
    const errMsg = `Attempted to set the state of\n\n${atom}\n\nwith:\n\n${prettyPrint(
      nextState
    )}\n\nbut it did not pass validator:\n${validator}\n\n`;
    const err = Error(errMsg);
    err.name = "AtomInvalidStateError";

    throw err;
  } else {
    stateByAtomId[atom["$$id"]] = nextState;
  }
}

//
// ======================================= GETVALIDATOR ==============================================
//

/**
 * Gets `atom`'s validator function
 *
 * @param <S> the type of `atom`'s inner state
 *
 * @example
```js

import {Atom, deref, getValidator, swap} from '@libre/atom'

const atom = Atom.of({ count: 0 }, { validator: (state) => isEven(state.count) })
const validator = getValidator(atom)
validator({ count: 3 }) // => false
validator({ count: 2 }) // => true
```
 */

export function getValidator<S>(atom: Atom<S>): NonNullable<AtomConstructorOptions<any>["validator"]> {
  throwIfNotAtom(atom);
  return validatorByAtomId[atom["$$id"]];
}

//
// ======================================= SETVALIDATOR ==============================================
//

/**
 * Sets the `validator` for `atom`. `validator` must be a pure function of one argument,
 * which will be passed the intended new state on any state change. If the new state is
 * unacceptable, `validator` should return false or throw an exception. If the current state
 * is not acceptable to the new validator, an exception will be thrown and the validator will
 * not be changed.
 *
 * @param <S> the type of `atom`'s inner state
 *
 * @example
```js

import {Atom, deref, setValidator, set} from '@libre/atom'

const atom = Atom.of({ count: 0 }, {validator: (state) => isNumber(state.count) })
setValidator(atom, (state) => isOdd(state.count)) // Error; new validator rejected
set(atom, {count: "not number"}) // Error; new state not set
setValidator(atom, (state) => isEven(state.count)) // All good
set(atom, {count: 2}) // All good

```
 */

export function setValidator<S>(atom: Atom<S>, validator: NonNullable<AtomConstructorOptions<any>["validator"]>): void {
  throwIfNotAtom(atom);
  if (!validator(getState(atom))) {
    const errMsg = `Could not set validator on\n\n${atom}\n\nbecause current state would be invalid according to new validator:\n${validator}\n\n`;
    const err = Error(errMsg);
    err.name = "AtomInvalidStateError";
    throw err;
  } else {
    validatorByAtomId[atom["$$id"]] = validator;
  }
}
