# @ntf/udon

VRChat Udon Compiler in TypeScript or something like that

## Installation

Use your favourite package manager, idk

```sh
npm install @ntf/udon
```

```sh
yarn add @ntf/udon
```

```sh
pnpm install @ntf/udon
```

## Usage

### Importing

This library can be used in `CommonJS` and `ESModule` environments

```typescript
const { ... } = require("@ntf/udon");
```

```typescript
import { ... } from "@ntf/udon";
```

### Reading an Assembly

If you have an assembly file, you can read it:

```typescript
// parse the content of the assembly file (not the file path)
const asm: UdonAssembly = UdonAssembly.parse(contentOfAssembly);
```

### Writing to a file/string

With a `UdonAssembly` instance you can call `toString` to generate the content of the udon assembly

```typescript
// This also makes it work with functions that call `toString`
const content: string = asm.toString();
// for example to write to file in NodeJS
writeFileSync(somePath,content,"utf-8");
```

## License stuff that nobody reads

Just like any [Open Source Project](https://github.com/N1ghtTheF0x/ntf-udon) this has a [License](./LICENSE), the MIT License
