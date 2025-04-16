import { CommentUdonStatement } from "./common/comment"
import { ExportUdonStatement } from "./common/export"
import { SyncUdonStatement, UdonSyncMode } from "./common/sync"

/**
 * A statement that can be found inside {@link UdonSection}s
 */
export type UdonSectionStatement = ExportUdonStatement | SyncUdonStatement | CommentUdonStatement

/**
 * Represents a generic section in Udon Assembly
 */
export abstract class UdonSection
{
    /**
     * Parse a {@link UdonSectionStatement} from a string
     * @param line A string
     * @returns A {@link UdonSectionStatement}
     * @throws Parsing Error
     */
    public static parseStatement(line: string): UdonSectionStatement
    {
        const tline = line.trim()
        if(tline.startsWith(CommentUdonStatement.COMMENT_PREFIX))
            return CommentUdonStatement.parse(tline)
        if(tline.startsWith(".export "))
            return ExportUdonStatement.parse(tline)
        if(tline.startsWith(".sync "))
            return SyncUdonStatement.parse(tline)
        throw new Error(`unsupported statement "${tline}"`)
    }
    /**
     * Create a {@link UdonSection}
     * @param statements A list of statements in this section
     */
    public constructor(public statements: Array<UdonSectionStatement> = [])
    {

    }
    /**
     * Export an statement in this section
     * @param name The name of the statement
     * @returns this
     */
    public addExport(name: string)
    {
        return this.addStatement(new ExportUdonStatement(name))
    }
    /**
     * Sync a statement in this section
     * @param name The name of the statement
     * @param mode The sync mode, `"none"`, `"linear"` and `"smooth"` are the only options
     * @returns this
     */
    public addSync(name: string,mode: UdonSyncMode)
    {
        return this.addStatement(new SyncUdonStatement(name,mode))
    }
    /**
     * Add a line comment. This statement has no logic
     * @param comment The content of the comment
     * @returns this
     */
    public addComment(comment: string)
    {
        return this.addStatement(new CommentUdonStatement(comment))
    }
    /**
     * Add a statement to this section
     * @param statement A statement
     * @returns this
     */
    public addStatement(statement: UdonSectionStatement)
    {
        this.statements.push(statement)
        return this
    }
    /**
     * Get the string representation of this section
     */
    public abstract toString(): string
}