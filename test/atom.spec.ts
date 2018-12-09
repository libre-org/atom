import { Atom } from "../src";

describe("Atom instance", () => {
  it("can be instantiated by the static Atom.of method", () => {
    expect(Atom.of(1)).toBeInstanceOf(Atom);
  });

  it("has a public instance member $$id which is a number that acts as its unique ID", () => {
    const id = Atom.of(1)["$$id"];
    expect(typeof id).toBe("number");
  });

  it("cannot be modified directly", () => {
    const TEST_ATOM = Atom.of(1);

    const illegalWrite = () => {
      (TEST_ATOM as any).someProp = "someVal";
    };

    expect(illegalWrite).toThrow(new TypeError("Cannot add property someProp, object is not extensible"));
  });
});
