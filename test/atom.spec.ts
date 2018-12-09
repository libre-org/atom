import { Atom } from "../src";

describe("Atom instance", () => {
  it("can be instantiated by the static Atom.of method", () => {
    expect(Atom.of(1)).toBeInstanceOf(Atom);
  });

  it("has a readonly public instance member $$id which is a number that acts as its unique ID", () => {
    const a = Atom.of(1);
    const id = a["$$id"];
    expect(typeof id).toBe("number");

    expect(() => {
      (a as any)["$$id"] = 1000e10;
    }).toThrow(TypeError);

    expect(a["$$id"]).toBe(id);
  });

  it("implements toString and inspect", () => {
    const a = Atom.of({ a: "hi" });
    expect(typeof a.toString()).toBe("string");
    expect(typeof a.inspect()).toBe("string");
  });
});
