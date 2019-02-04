import { Atom } from "./atom";
import { _getState, _getValidator, _runChangeHandlers, _setState } from "./internal-state";
import { DeepImmutable } from "./internal-types";
import { _prettyPrint, _throwIfNotAtom } from "./utils";

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
  _throwIfNotAtom(atom);
  const nextState = updateFn(_getState(atom));
  const validator = _getValidator(atom);
  const didValidate = validator(nextState as DeepImmutable<S>);
  if (!didValidate) {
    const errMsg = `swap updateFn\n${updateFn}\n\nattempted to swap the state of\n\n${atom}\n\nwith:\n\n${_prettyPrint(
      nextState
    )}\n\nbut it did not pass validator:\n${validator}\n\n`;
    const err = Error(errMsg);
    err.name = "AtomInvalidStateError";

    throw err;
  } else {
    _setState(atom, nextState);
    _runChangeHandlers(atom);
  }
}
