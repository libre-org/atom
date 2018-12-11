import { Atom } from "./atom";
import { AtomConstructorOptions, DeepImmutable } from "./internal-types";

let nextAtomUid = 0;
const stateByAtomId: Record<number, DeepImmutable<any>> = Object.create(null);
const validatorByAtomId: Record<number, NonNullable<AtomConstructorOptions<any>["validator"]>> = Object.create(null);

/** @ignore */
export function _useNextAtomId() {
  return nextAtomUid++;
}

/** @ignore */
export function _getState<S>(atom: Atom<S>): DeepImmutable<S> {
  return stateByAtomId[atom["$$id"]];
}
/** @ignore */
export function _setState<S>(atom: Atom<S>, state: S): void {
  stateByAtomId[atom["$$id"]] = state;
}

/** @ignore */
export function _getValidator<S>(atom: Atom<S>): NonNullable<AtomConstructorOptions<S>["validator"]> {
  return validatorByAtomId[atom["$$id"]];
}

/** @ignore */
export function _setValidator<S>(atom: Atom<S>, validator: NonNullable<AtomConstructorOptions<S>["validator"]>): void {
  validatorByAtomId[atom["$$id"]] = validator;
}
