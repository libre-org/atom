<div>
  <p align="center">
    <img 
      src="https://document-export.canva.com/DADLRIBWTFM/45/preview/0001-645846858.png"
      height="350"
      width="350"
      alt="@libre/atom logo" />
  </p>
</div>

<h3 align="center">A way to manage shared, synchronous, independent state</h3>

<h3 align="center">Inspired by <a href="https://clojure.org/reference/atoms">atom</a>s in <a href="https://clojure.org/index">Clojure(Script)</a></h3>

[![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![npm (scoped)](https://img.shields.io/npm/v/@libre/atom.svg)](https://www.npmjs.com/package/@libre/atom)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@libre/atom.svg)](https://bundlephobia.com/result?p=@libre/atom)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@libre/atom.svg)](https://bundlephobia.com/result?p=@libre/atom)

[![Build Status](https://travis-ci.com/libre-org/atom.svg?branch=master)](https://travis-ci.com/libre-org/atom)
[![codecov](https://codecov.io/gh/libre-org/atom/branch/master/graph/badge.svg)](https://codecov.io/gh/libre-org/atom)
[![npm](https://img.shields.io/npm/dt/@libre/atom.svg)](https://www.npmjs.com/package/@libre/atom)

[![NpmLicense](https://img.shields.io/npm/l/@libre/atom.svg)](https://www.npmjs.com/package/@libre/atom)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Description

### Put your state in an `Atom`:

```ts
import { Atom } from "@libre/atom";

const appState = Atom.of({
  color: "blue",
  userId: 1
});
```

### Read state with `deref`

You can't inspect `Atom` state directly, you have to `deref`erence it, like this:

```js
import { deref } from "@libre/atom";

const { color } = deref(appState);
```

### Update state with `swap`

You can't modify an `Atom` directly. The main way to update state is with `swap`. Here's its call signature:

```ts
function swap<S>(atom: Atom<S>, updateFn: (state: S) => S): void;
```

`updateFn` is applied to `atom`'s state and the return value is set as `atom`'s new state. There are just two simple rules for `updateFn`:

1. it must return a value of the same type/interface as the previous state
2. it must not mutate the previous state

To illustrate, here is how we might update `appState`'s color:

```js
import { swap } from "@libre/atom";

const setColor = color =>
  swap(appState, state => ({
    ...state,
    color: color
  }));
```

Take notice that our `updateFn` is [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)ing the old state onto a new object before overriding `color`. This is an easy way to obey the rules of `updateFn`.

## Installation

`react-atom` has zero `dependencies`!

```
npm i -S @libre/atom
```

## Documentation

[You can find API docs for `@libre/atom` here](https://libre-org.github.io/atom/)

## Contributing / Feedback

Please open an issue if you have any questions, suggestions for
improvements/features, or want to submit a PR for a bug-fix (please include
tests if applicable).
