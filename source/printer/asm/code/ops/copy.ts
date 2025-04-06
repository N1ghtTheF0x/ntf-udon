import { UdonCodeStatement } from "../statement"

export const COPY_STATEMENT_NAME = "COPY"

/**
 * Pops two heap indexes. The value from the second heap index popped (aka the first heap index pushed) is copied to the first heap index popped (aka the second heap index pushed).
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#copy Reference}
 */
export class CopyUdonCodeStatement extends UdonCodeStatement
{
    /**
     * Parse a {@link CopyUdonCodeStatement} from a string
     * @param line A string
     * @returns A {@link CopyUdonCodeStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        if(tline !== COPY_STATEMENT_NAME)
            throw new Error("not a copy statement")
        return new this
    }
    /**
     * Create a {@link CopyUdonCodeStatement}
     */
    public constructor()
    {
        super(COPY_STATEMENT_NAME,9,0)
    }
    public toString(): string
    {
        return `${this.name}`
    }
}