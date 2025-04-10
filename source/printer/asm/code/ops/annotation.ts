import { UdonCodeParameter, UdonCodeStatement } from "../statement"

export const ANNOTATION_STATEMENT_NAME = "ANNOTATION"

/**
 * This is effectively a "long NOP". The parameter is ignored
 * 
 * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#annotation-parameter Reference}
 */
export class AnnotationUdonCodeStatement extends UdonCodeStatement
{
    /**
     * Parse a {@link AnnotationUdonCodeStatement} from a string
     * @param line A string
     * @returns A {@link AnnotationUdonCodeStatement}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        const parts = tline.split(",")
        if(parts.length === 0)
            throw new Error("no parameters found")
        const name = parts[0]
        if(name !== ANNOTATION_STATEMENT_NAME)
            throw new Error("not a annotation statement")
        if(parts.length !== 2)
            throw new Error(`expected 1 parameter, got ${parts.length} instead`)
        const parameter = parts[1].trim()
        if(parameter.length === 0)
            throw new Error("invalid parameter value")
        return new this(this.parseParameter(parameter))
    }
    /**
     * Create a {@link AnnotationUdonCodeStatement}
     * @param parameter Unused
     */
    public constructor(public parameter: UdonCodeParameter)
    {
        super(ANNOTATION_STATEMENT_NAME,7,1)
    }
    public toString(): string
    {
        return `${this.name}, ${UdonCodeStatement.printParameter(this.parameter)}`
    }
}