import { UdonStatement } from "../statement"

/**
 * A abstract representation of an opcode
 */
export abstract class UdonCodeStatement extends UdonStatement
{
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