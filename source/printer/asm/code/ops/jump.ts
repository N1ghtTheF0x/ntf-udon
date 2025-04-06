import { UdonCodeStatement } from "../statement"

export const JUMP_STATEMENT_NAME = "JUMP"

/**
 * Jumps to the bytecode position given by the parameter.
 * 
 * `JUMP, 0xFFFFFFFC` is also used to end execution (i.e. return from Udon code).
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#jump-parameter Reference}
 */
export class JumpUdonCodeStatement extends UdonCodeStatement
{
    /**
     * Parse a {@link JumpUdonCodeStatement} from a string
     * @param line A string
     * @returns A {@link JumpUdonCodeStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        const parts = tline.split(",")
        if(parts.length === 0)
            throw new Error("no parameters found")
        const name = parts[0]
        if(name !== JUMP_STATEMENT_NAME)
            throw new Error("not a jump statement")
        if(parts.length !== 2)
            throw new Error(`expected 1 parameter, got ${parts.length} instead`)
        const position = parts[1].trim()
        if(position.length === 0)
            throw new Error("invalid position parameter")
        return new this(position)
    }
    /**
     * Create a {@link JumpUdonCodeStatement}
     * @param position Position to jump to
     */
    public constructor(public position: string)
    {
        super(JUMP_STATEMENT_NAME,5,1)
    }
    public toString(): string
    {
        return `${this.name}, ${this.position}`
    }
}