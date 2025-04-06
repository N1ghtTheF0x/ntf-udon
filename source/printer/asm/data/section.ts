import { getLines } from "../../utilities"
import { UdonSection, UdonSectionStatement } from "../section"
import { UdonDataField, UdonDataValue } from "./field"

export const VRCHAT_UDON_DATA_START = ".data_start"
export const VRCHAT_UDON_DATA_END = ".data_end"

/**
 * Represents the data section of a Udon Assembly
 */
export class UdonDataSection extends UdonSection
{
    /**
     * Parse a {@link UdonDataSection} from `content`
     * @param content A multiline string with `.data_start` and `.data_end` as the beginning and last line respectively
     * @returns A {@link UdonDataSection}
     * @throws Parsing Error
     */
    public static parse(content: string)
    {
        const lines = getLines(content)
        if(lines[0] !== VRCHAT_UDON_DATA_START)
            throw new Error(`no "${VRCHAT_UDON_DATA_START}" found`)
        if(lines[lines.length-1] !== VRCHAT_UDON_DATA_END)
            throw new Error(`no "${VRCHAT_UDON_DATA_END}" found`)
        const data = lines.slice(1,lines.length-2)

        const statements = data
        .filter((statement) => statement.startsWith(".export ") || statement.startsWith(".sync "))
        .map((statement) => UdonSection.parseStatement(statement))

        const fields = data
        .filter((field) => !field.startsWith("."))
        .map((field) => UdonDataField.parse(field))

        return new this(statements,fields)
    }
    /**
     * Create a {@link UdonDataSection}
     * @param fields The fields stored in this data section. They might be exposed or not
     */
    public constructor(statements: Array<UdonSectionStatement> = [],public fields: Array<UdonDataField> = [])
    {
        super(statements)
    }
    /**
     * Add a private {@link UdonDataField} to this data section
     * @param name The name of the field
     * @param type The type of the field
     * @param value The inital value of the field, optional
     * @returns this
     */
    public addPrivateField(name: string,type: string,value?: UdonDataValue)
    {
        this.fields.push(new UdonDataField(name,type,value))
        return this
    }
    /**
     * Add a public {@link UdonDataField} to this data section. It will export this field
     * @param name The name of the field
     * @param type The type of the field
     * @param value The inital value of the field, optional
     * @returns this
     */
    public addPublicField(name: string,type: string,value?: UdonDataValue)
    {
        this.addExport(name)
        this.addPrivateField(name,type,value)
        return this
    }
    public toString(): string
    {
        return [
            VRCHAT_UDON_DATA_START,
            ...this.statements.map((statements) =>  "    " + statements.toString()),
            ...this.fields.map((field) => "    " + field.toString()),
            VRCHAT_UDON_DATA_END
        ].join("\n")
    }
}