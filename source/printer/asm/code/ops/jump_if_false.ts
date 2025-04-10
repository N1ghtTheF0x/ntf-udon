import { UdonCodeParameter, UdonCodeStatement } from "../statement"

export const JUMP_IF_FALSE_STATEMENT_NAME = "JUMP_IF_FALSE"

/**
 * Pops a heap index from the stack and reads a `SystemBoolean` from it.
 * 
 * If this value is `false`, jumps to the parameter as a bytecode position. Otherwise, continues to the next instruction.
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#jump_if_false-parameter Reference}
 */
export class JumpIfFalseUdonCodeStatement extends UdonCodeStatement
{
    /**
     * Parse a {@link JumpIfFalseUdonCodeStatement} from a string
     * @param line A string
     * @returns A {@link JumpIfFalseUdonCodeStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        const parts = tline.split(",")
        if(parts.length === 0)
            throw new Error("no parameters found")
        const name = parts[0]
        if(name !== JUMP_IF_FALSE_STATEMENT_NAME)
            throw new Error("not a jump if false statement")
        if(parts.length !== 2)
            throw new Error(`expected 1 parameter, got ${parts.length} instead`)
        const position = parts[1].trim()
        if(position.length === 0)
            throw new Error("invalid position parameter")
        return new this(this.parseParameter(position))
    }
    /**
     * Create a {@link JumpIfFalseUdonCodeStatement}
     * @param position Position to jump to
     */
    public constructor(public position: UdonCodeParameter)
    {
        super(JUMP_IF_FALSE_STATEMENT_NAME,4,1)
    }
    public toString(): string
    {
        return `${this.name}, ${UdonCodeStatement.printParameter(this.position)}`
    }
}