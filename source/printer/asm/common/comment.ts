import { UdonStatement } from "../statement"

/**
 * Represnets a comment statement that is prefixed with `#`
 */
export class CommentUdonStatement extends UdonStatement
{
    public override comment: string
    public static parse(line: string)
    {
        const tline = line.trim()
        if(!tline.startsWith(this.COMMENT_PREFIX))
            throw new Error("not a comment")
        return new this(tline.substring(1).trim())
    }
    public constructor(comment: string)
    {
        super()
        this.comment = comment
    }
    public toString(): string
    {
        return this._get_comment()
    }
}