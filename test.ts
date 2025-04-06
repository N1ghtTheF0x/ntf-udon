import { UdonAssembly } from "./dist/index.mjs"
import { readFileSync } from "node:fs"

const udon = UdonAssembly.parse(readFileSync("test.udon","utf-8"))
console.dir(udon)