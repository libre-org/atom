// tslint:disable:no-console
import { addChangeHandler, Atom, deref, removeChangeHandler, set, swap } from "../../src";

describe("Atom change handlers", function() {
  describe("addChangeHandler", function() {
    it("registers a function that takes named params of `previous` and `current` state that runs on every state change", function() {
      const testAtom = Atom.of(1);
      const mock = { log: (...args: any[]) => null };
      const logSpy = spyOn(mock, "log");
      addChangeHandler(testAtom, "print", ({ previous, current }) => {
        expect(previous).not.toBe(current);
        expect(current).toBe(deref(testAtom));
        mock.log(previous, current);
      });
      swap(testAtom, x => x + 1);
      set(testAtom, 0);
      swap(testAtom, x => x + 1);
      expect(logSpy).toHaveBeenCalledTimes(3);
    });

    it("throws Error when attempting to register a handler on a key that is already in use", function() {
      const testAtom = Atom.of(1);
      addChangeHandler(testAtom, "print", print);
      expect(() => addChangeHandler(testAtom, "print", print)).toThrow(Error);
    });
  });

  describe("removeChangeHandler", function() {
    it("unregisters the handler function at specified key so that it no longer runs on state change", function() {
      const testAtom = Atom.of(1);
      const mock = { log: (...args: any[]) => null };
      const logSpy = spyOn(mock, "log");
      addChangeHandler(testAtom, "print", ({ previous, current }) => {
        expect(previous).not.toBe(current);
        expect(current).toBe(deref(testAtom));
        mock.log(previous, current);
      });
      swap(testAtom, x => x + 1);
      removeChangeHandler(testAtom, "print");
      set(testAtom, 0);
      swap(testAtom, x => x + 1);
      expect(logSpy).toHaveBeenCalledTimes(1);
    });
  });
});
