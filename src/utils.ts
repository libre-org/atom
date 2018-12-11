import { Atom } from "./atom";
import * as ErrorMsgs from "./error-messages";

/** @ignore */
export const prettyPrint = (val: any): string => JSON.stringify(val, null, "  ");

/** @ignore */
export const throwIfNotAtom = <S>(atom: Atom<S>): void | never => {
  if (!(atom instanceof Atom)) {
    throw TypeError(`${ErrorMsgs.expectedAtomButGot}\n\n${prettyPrint(atom)}`);
  }
};
