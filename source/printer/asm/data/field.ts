import { stripUdonType } from "../../utilities"
import { UdonStatement } from "../statement"

/**
 * Valid value types the {@link UdonDataField} can hold
 */
export type UdonDataValue = "null" | "this" | `${boolean}` | `"${string}"` | `${number}` | `${number}u`

/**
 * Represents a data field in the data section
 */
export class UdonDataField extends UdonStatement
{
    /**
     * Parse a {@link UdonDataField} from a string
     * @param line A string
     * @returns A {@link UdonDataField}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        const name = tline.substring(0,tline.indexOf(":"))
        if(name.length === 0)
            throw new Error("invalid name")
        const type = tline.substring(tline.indexOf("%")+1,tline.indexOf(","))
        if(type.length === 0)
            throw new Error("invalid type")
        const value = tline.substring(tline.indexOf(",")+1).trim() as UdonDataValue
        if(value.length === 0)
            throw new Error("invalid value")
        return new this(name,type,value)
    }
    /**
     * Create a new {@link UdonDataField}
     * @param name The name of the field
     * @param type The type of the field
     * @param value The initial value of the field, optional
     */
    public constructor(public name: string,public type: string,public value?: UdonDataValue)
    {
        super()
    }
    public toString()
    {
        return `${this.name}: %${stripUdonType(this.type)}, ${this.value ?? "null"}` as const
    }
}