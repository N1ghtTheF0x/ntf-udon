import { UdonCodeStatement } from "../statement"

export const JUMP_INDIRECT_STATEMENT_NAME = "JUMP_INDIRECT"

/**
 * Gets a heap index from the parameter and reads a `SystemUInt32` from it.
 * 
 * Interprets this as a bytecode position and jumps to it.
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#jump_indirect-parameter Reference}
 */
export class JumpIndirectUdonCodeStatement extends UdonCodeStatement
{
    /**
     * Parse a {@link JumpIndirectUdonCodeStatement} from a string
     * @param line A string
     * @returns A {@link JumpIndirectUdonCodeStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        const parts = tline.split(",")
        if(parts.length === 0)
            throw new Error("no parameters found")
        const name = parts[0]
        if(name !== JUMP_INDIRECT_STATEMENT_NAME)
            throw new Error("not a jump indirect statement")
        if(parts.length !== 2)
            throw new Error(`expected 1 parameter, got ${parts.length} instead`)
        const position = parts[1].trim()
        if(position.length === 0)
            throw new Error("invalid position parameter")
        return new this(position)
    }
    /**
     * Create a {@link JumpIndirectUdonCodeStatement}
     * @param index Index from heap
     */
    public constructor(public index: string)
    {
        super(JUMP_INDIRECT_STATEMENT_NAME,8,1)
    }
    public toString(): string
    {
        return `${this.name}, ${this.index}`
    }
}