import { UdonCodeStatement } from "../statement"

export const POP_STATEMENT_NAME = "POP"

/**
 * This opcode removes the top integer from the stack, with no further effects.
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#pop Reference}
 */
export class PopUdonCodeStatement extends UdonCodeStatement
{
    /**
     * Parse a {@link PopUdonCodeStatement} from a string
     * @param line A string
     * @returns A {@link PopUdonCodeStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        if(tline !== POP_STATEMENT_NAME)
            throw new Error("no a pop statement")
        return new this
    }
    /**
     * Create a {@link PopUdonCodeStatement}
     */
    public constructor()
    {
        super(POP_STATEMENT_NAME,2,0)
    }
    public toString(): string
    {
        return this.name
    }
}