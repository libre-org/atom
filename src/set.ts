import { Atom } from "./atom";
import { _getValidator, _setState } from "./internal-state";
import { DeepImmutable } from "./internal-types";
import { _prettyPrint, _throwIfNotAtom } from "./utils";

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
  _throwIfNotAtom(atom);
  const validator = _getValidator(atom);
  const didValidate = validator(nextState as DeepImmutable<S>);
  if (!didValidate) {
    const errMsg = `Attempted to set the state of\n\n${atom}\n\nwith:\n\n${_prettyPrint(
      nextState
    )}\n\nbut it did not pass validator:\n${validator}\n\n`;
    const err = Error(errMsg);
    err.name = "AtomInvalidStateError";

    throw err;
  } else {
    _setState(atom, nextState);
  }
}
