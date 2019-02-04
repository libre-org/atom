import { Atom } from "./atom";
import { _addChangeHandler, _removeChangeHandler } from "./internal-state";

/**
 * Registers a function to be run each time the state of `atom` changes.
 *
 * Will throw an Error if `key` is already taken by another handler.
 *
 * @example
```js

import {Atom, addChangeHandler, swap} from '@libre/atom'

const countAtom = Atom.of({ count: 0 })

addChangeHandler(countAtom, "log", (state) => { console.log(state) })

swap(countAtom, (state) => ({ count: state.count + 1 }))

// stdout logs: { count: 1 }
```
 */
export function addChangeHandler<S>(atom: Atom<S>, key: string, handler: (state: S) => void) {
  _addChangeHandler(atom, key, handler);
}

/**
 * Deletes the `key` and the handler associated with `key` so that it not longer runs
 * when the state of `atom` changes.
 */
export function removeChangeHandler<S>(atom: Atom<S>, key: string) {
  _removeChangeHandler(atom, key);
}
