import { getLines } from "../../utilities"
import { UdonSection, UdonSectionStatement } from "../section"
import { UdonCodeEvent } from "./event"

export const VRCHAT_UDON_CODE_START = ".code_start"
export const VRCHAT_UDON_CODE_END = ".code_end"

/**
 * Represents the code section of a Udon Assembly
 */
export class UdonCodeSection extends UdonSection
{
    /**
     * Parse a {@link UdonCodeSection} from `content`
     * @param content A multiline string with `.code_start` and `.code_end` as the beginning and last line respectively
     * @returns A {@link UdonCodeSection}
     * @throws Parsing Error
     */
    public static parse(content: string)
    {
        const lines = getLines(content)
        if(lines[0] !== VRCHAT_UDON_CODE_START)
            throw new Error(`no "${VRCHAT_UDON_CODE_START}" found`)
        if(lines[lines.length-1] !== VRCHAT_UDON_CODE_END)
            throw new Error(`no "${VRCHAT_UDON_CODE_END}" found`)

        const statements = lines
        .filter((line) => line.startsWith(".export ") || line.startsWith(".sync "))
        .map((line) => UdonSection.parseStatement(line))

        const code = UdonCodeEvent.parse(
            lines
            .filter((line) => !line.startsWith("."))
            .join("\n")
        )
        return new this(statements,code)
    }
    /**
     * Create a {@link UdonCodeSection}
     * @param events The events stored in the code section, default is empty array
     */
    public constructor(statements: Array<UdonSectionStatement> = [],public events: Array<UdonCodeEvent> = [])
    {
        super(statements)
    }
    /**
     * Create a new {@link UdonCodeEvent} in this code section
     * @param name The name of the symbol
     * @returns The newly created {@link UdonCodeEvent}
     */
    public addEvent(name: string)
    {
        const event = new UdonCodeEvent(name)
        this.events.push(event)
        return event
    }
    public toString()
    {
        return [
            VRCHAT_UDON_CODE_START,
            ...this.statements.map((statements) => "    " + statements.toString()),
            ...this.events.map((event) => event.toString()),
            VRCHAT_UDON_CODE_END
        ].join("\n")
    }
}