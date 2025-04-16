import { UdonStatement } from "../statement"

/**
 * Various sync modes statements can have
 */
export type UdonSyncMode = "none" | "linear" | "smooth"

/**
 * Represents a `.sync` statement
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#the-data-section Reference at last text block}
 */
export class SyncUdonStatement extends UdonStatement
{
    /**
     * Parse a {@link SyncUdonStatement} from a string
     * @param line A string
     * @returns A {@link SyncUdonStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        if(!tline.startsWith(".sync "))
            throw new Error("not a sync statement")
        const name = tline.substring(6,tline.indexOf(","))
        if(name.length === 0)
            throw new Error("invalid name")
        const mode = tline.substring(tline.indexOf(",")+1).trim() as UdonSyncMode
        if(mode.length === 0)
            throw new Error("invalid sync mode")
        return new this(name,mode)
    }
    /**
     * Create a {@link SyncUdonStatement}
     * @param name The name of the field
     * @param mode The sync mode to use
     */
    public constructor(public name: string,public mode: UdonSyncMode,comment?: string)
    {
        super(comment)
    }
    public toString(): string
    {
        return `.sync ${this.name}, ${this.mode}`
    }
}