import { ExternReference } from "../../../externreference"
import { UdonCodeStatement } from "../statement"

export const EXTERN_STATEMENT_NAME = "EXTERN"

/**
 * This opcode is how Udon performs any useful operation whatsoever.
 * 
 * The first thing to note is that the parameter is a heap index, initially containing the extern name (as a string), _but this is also written to._
 * 
 * As an optimization, Udon caches information about the extern after it is first run in the given heap index. These values are still heap values and can be copied.
 * 
 * The parameters to the extern are given in `PUSH` order; that is, the first value pushed is the first argument.
 * 
 * These heap values are read for normal (i.e. `in`) arguments, read and written for `ref` arguments, and written for `out` arguments.
 * 
 * If the extern is not static (i.e. if it has a `this` argument), the `this` argument is added at the start. If there is a return value (i.e. the return type is not `SystemVoid`), it is treated like an `out` argument at the end.
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#extern-parameter Reference}
 */
export class ExternUdonCodeStatement extends UdonCodeStatement
{
    /**
     * Parse a {@link ExternUdonCodeStatement} from a string
     * @param line A string
     * @returns A {@link ExternUdonCodeStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        const parts = tline.split(",")
        if(parts.length === 0)
            throw new Error("no parameters found")
        const name = parts[0]
        if(name !== EXTERN_STATEMENT_NAME)
            throw new Error("not a extern statement")
        if(parts.length !== 2)
            throw new Error(`expected 1 parameter, got ${parts.length} instead`)
        const reference = parts[1].trim()
        if(reference.length === 0)
            throw new Error("invalid reference parameter")
        return new this(ExternReference.parse(reference))
    }
    /**
     * Create a {@link ExternUdonCodeStatement}
     * @param reference A extern reference
     */
    public constructor(public reference: ExternReference)
    {
        super(EXTERN_STATEMENT_NAME,6,1)
    }
    public toString(): string
    {
        return `${this.name}, ${this.reference.build()}`
    }
}