import { UdonCodeStatement } from "../statement"

export const PUSH_STATEMENT_NAME = "PUSH"

/**
 * This opcode pushes an integer to the top of the stack.
 * 
 * Udon Assembly may give the impression that a value is being pushed; this is not the case.
 * 
 * In these cases, it is the heap address that is being pushed.
 * 
 * Unless you are very dedicated to size-optimizing your Udon programs (even at the expense of runtime speed in some cases), or trying to obfuscate, there is never any reason to use this in a conditional fashion. Simply push everything immediately before `EXTERN`, `COPY` or `JUMP_IF_FALSE`.
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#push-parameter Reference}
 */
export class PushUdonCodeStatement extends UdonCodeStatement
{
    /**
     * Parse a {@link PushUdonCodeStatement} from a string
     * @param line A string
     * @returns A {@link PushUdonCodeStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        const parts = tline.split(",")
        if(parts.length === 0)
            throw new Error("no parameters found")
        const name = parts[0]
        if(name !== PUSH_STATEMENT_NAME)
            throw new Error("not a push statement")
        if(parts.length !== 2)
            throw new Error(`expected 1 parameter, got ${parts.length} instead`)
        const value = parts[1].trim()
        if(value.length === 0)
            throw new Error("invalid value parameter")
        return new this(value)
    }
    /**
     * Create a {@link PushUdonCodeStatement}
     * @param value Value to push
     */
    public constructor(public value: string)
    {
        super(PUSH_STATEMENT_NAME,1,1)
    }
    public toString(): string
    {
        return `${this.name}, ${this.value}`
    }
}