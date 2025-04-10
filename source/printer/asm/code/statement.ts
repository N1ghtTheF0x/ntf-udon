import { UdonStatement } from "../statement"

/**
 * Valid {@link UdonCodeStatement} parameter types
 */
export type UdonCodeParameter = string | number

/**
 * A abstract representation of an opcode
 */
export abstract class UdonCodeStatement extends UdonStatement
{
    /**
     * Returns a string representation of {@link UdonCodeParameter}
     * @param parameter A {@link UdonCodeParameter}
     * @returns A string
     */
    public static printParameter(parameter: UdonCodeParameter)
    {
        if(typeof parameter == "number")
            return `0x${parameter.toString(16).padStart(8,"0")}`
        return parameter
    }
    /**
     * Parse `parameter` into a {@link UdonCodeParameter}
     * @param parameter A string
     * @returns A {@link UdonCodeParameter}
     */
    public static parseParameter(parameter: string): UdonCodeParameter
    {
        if(parameter.startsWith("0x"))
            return parseInt(parameter.substring(0,10))
        return parameter
    }
    /**
     * Create a {@link UdonCodeStatement}
     * @param name The name of the opcode
     * @param opcode The numeric value of the opcode
     * @param parameters The count of the parameters this opcode needs
     */
    protected constructor(public readonly name: string,public readonly opcode: number,public readonly parameters: number)
    {
        super()
    }
}