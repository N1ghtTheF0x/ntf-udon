import { UdonCodeStatement } from "../statement"

export const NOP_STATEMENT_NAME = "NOP"

/**
 * This opcode does nothing. There is generally no reason to use this, unless you get the `Address aliasing detected:` error.
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#nop Reference}
 */
export class NoOperationUdonCodeStatement extends UdonCodeStatement
{
    /**
     * Parse a {@link NoOperationUdonCodeStatement} from a string
     * @param line A string
     * @returns A {@link NoOperationUdonCodeStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        if(tline !== NOP_STATEMENT_NAME)
            throw new Error("not a nop statement")
        return new this
    }
    /**
     * Create a {@link NoOperationUdonCodeStatement}
     */
    public constructor()
    {
        super(NOP_STATEMENT_NAME,0,0)
    }
    public toString(): string
    {
        return `${this.name}`
    }
}