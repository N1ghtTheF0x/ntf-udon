import { UdonStatement } from "../statement"

/**
 * Represents a `.export` statement
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#the-data-section Reference at last text block}
 */
export class ExportUdonStatement extends UdonStatement
{
    /**
     * Parse a {@link ExportUdonStatement} from a string
     * @param line A string
     * @returns A {@link ExportUdonStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        if(!tline.startsWith(".export "))
            throw new Error("not an export")
        return new this(tline.replace(".export ",""))
    }
    /**
     * Create a {@link ExportUdonStatement}
     * @param name The name of the exported field
     */
    public constructor(public name: string)
    {
        super()
    }
    public toString(): string
    {
        return `.export ${this.name}`
    }
}