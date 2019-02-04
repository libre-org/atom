import { Atom } from "./atom";
import * as ErrorMsgs from "./error-messages";
import { _getState } from "./internal-state";

/** @ignore */
export function _prettyPrint(val: any): string {
  return JSON.stringify(val, null, "  ");
}

/** @ignore */
export function _throwIfNotAtom<S>(atom: Atom<S>): void | never {
  if (!(atom instanceof Atom)) {
    throw TypeError(`${ErrorMsgs.expectedAtomButGot}\n\n${_prettyPrint(atom)}`);
  }
}
