import { Atom } from "./atom";
import { _getState } from "./internal-state";
import { DeepImmutable } from "./internal-types";
import { _throwIfNotAtom } from "./utils";

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
  _throwIfNotAtom(atom);
  return _getState(atom);
}
