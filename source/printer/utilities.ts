/**
 * Remove `.`, `+` and replace `[]` with `Array` in `type`
 * @param type A string
 * @returns A Udon Type
 */
export function stripUdonType(type: string)
{
    return type.replaceAll(".","").replaceAll("+","").replaceAll("[]","Array")
}
/**
 * Split `content` into lines, works with `\r\n` and `\n`
 * @param content A multiline string
 * @returns `content` split by lines
 */
export function getLines(content: string)
{
    return content
    .replaceAll("\r\n","\n")
    .split("\n")
    .map((line) => line.trim())
}
/**
 * Remove Udon Assembly comments, anything that starts with `#`
 * @param content A multiline string
 * @returns `content` but with no lines/parts with `#`
 */
export function removeComments(content: string)
{
    return getLines(content)
    .filter((line) => !line.startsWith("#"))
    .map((line) =>
    {
        if(line.includes("#"))
            return line.substring(0,line.indexOf("#")).trim()
        return line
    })
    .join("\n")
}