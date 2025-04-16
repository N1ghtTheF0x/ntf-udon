/**
 * Represents a generic statement in the Udon Assembly
 */
export abstract class UdonStatement
{
    /**
     * The prefix of a comment section
     */
    public static readonly COMMENT_PREFIX = "#"
    protected static _get_comment(line: string)
    {
        const tline = line.trim()
        if(tline.includes(this.COMMENT_PREFIX))
            return tline.substring(tline.indexOf(this.COMMENT_PREFIX)+1).trim()
    }
    /**
     * Create a {@link UdonStatement}
     * @param comment The comment that this statement might have, optional
     */
    public constructor(public comment?: string)
    {

    }
    /**
     * Get a string representation of the comment section of this statement
     */
    protected _get_comment(): "" | `${typeof UdonStatement.COMMENT_PREFIX} ${string}`
    {
        if(typeof this.comment == "string")
            return `${UdonStatement.COMMENT_PREFIX} ${this.comment}`
        return ""
    }
    /**
     * Get a string representation of this statement
     */
    public abstract toString(): string
}