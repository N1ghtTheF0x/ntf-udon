import { UdonCodeSection, VRCHAT_UDON_CODE_END, VRCHAT_UDON_CODE_START } from "./asm/code/section"
import { UdonDataSection, VRCHAT_UDON_DATA_END, VRCHAT_UDON_DATA_START } from "./asm/data/section"
import { getLines, removeComments } from "./utilities"

/**
 * Represents a Udon Assembly
 */
export class UdonAssembly
{
    /**
     * Parse a {@link UdonAssembly}
     * @param content Content of a Udon Assembly
     * @returns A {@link UdonAssembly}
     */
    public static parse(content: string)
    {
        const lines = getLines(removeComments(content))
        const dataStart = lines.indexOf(VRCHAT_UDON_DATA_START)
        if(dataStart < 0)
            throw new Error(`no "${VRCHAT_UDON_DATA_START}" found`)
        const dataEnd = lines.indexOf(VRCHAT_UDON_DATA_END)
        if(dataEnd < 0)
            throw new Error(`no "${VRCHAT_UDON_DATA_END}" found`)
        const codeStart = lines.indexOf(VRCHAT_UDON_CODE_START)
        if(codeStart < 0)
            throw new Error(`no "${VRCHAT_UDON_CODE_START}" found`)
        const codeEnd = lines.indexOf(VRCHAT_UDON_CODE_END)
        if(codeEnd < 0)
            throw new Error(`no "${VRCHAT_UDON_CODE_END}" found`)
        return new this(
            UdonDataSection.parse(lines.slice(dataStart,dataEnd+1).join("\n")),
            UdonCodeSection.parse(lines.slice(codeStart,codeEnd+1).join("\n"))
        )
    }
    /**
     * Create a {@link UdonAssembly}
     * @param data The data section of the assembly
     * @param code The code section of the assembly
     */
    public constructor(public readonly data: UdonDataSection = new UdonDataSection,public readonly code: UdonCodeSection = new UdonCodeSection)
    {

    }
    /**
     * Get the string representation of this assembly
     */
    public toString()
    {
        return [
            "# Udon Assembly generated with https://github.com/N1ghtTheF0x/ntf-udon",
            this.data.toString(),
            this.code.toString()
        ].join("\n")
    }
}