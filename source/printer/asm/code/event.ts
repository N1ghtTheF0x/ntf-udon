import { ExternReference } from "../../externreference"
import { getLines } from "../../utilities"
import { ANNOTATION_STATEMENT_NAME, AnnotationUdonCodeStatement } from "./ops/annotation"
import { COPY_STATEMENT_NAME, CopyUdonCodeStatement } from "./ops/copy"
import { EXTERN_STATEMENT_NAME, ExternUdonCodeStatement } from "./ops/extern"
import { JUMP_STATEMENT_NAME, JumpUdonCodeStatement } from "./ops/jump"
import { JUMP_IF_FALSE_STATEMENT_NAME, JumpIfFalseUdonCodeStatement } from "./ops/jump_if_false"
import { JUMP_INDIRECT_STATEMENT_NAME, JumpIndirectUdonCodeStatement } from "./ops/jump_indirect"
import { NoOperationUdonCodeStatement, NOP_STATEMENT_NAME } from "./ops/nop"
import { POP_STATEMENT_NAME, PopUdonCodeStatement } from "./ops/pop"
import { PUSH_STATEMENT_NAME, PushUdonCodeStatement } from "./ops/push"
import { UdonCodeStatement } from "./statement"

export const STATEMENTS = {
    [ANNOTATION_STATEMENT_NAME]: AnnotationUdonCodeStatement,
    [COPY_STATEMENT_NAME]: CopyUdonCodeStatement,
    [EXTERN_STATEMENT_NAME]: ExternUdonCodeStatement,
    [JUMP_IF_FALSE_STATEMENT_NAME]: JumpIfFalseUdonCodeStatement,
    [JUMP_INDIRECT_STATEMENT_NAME]: JumpIndirectUdonCodeStatement,
    [JUMP_STATEMENT_NAME]: JumpUdonCodeStatement,
    [NOP_STATEMENT_NAME]: NoOperationUdonCodeStatement,
    [POP_STATEMENT_NAME]: PopUdonCodeStatement,
    [PUSH_STATEMENT_NAME]: PushUdonCodeStatement
}

/**
 * Represents a code block of a label or built-in event
 */
export class UdonCodeEvent
{
    /**
     * The statements this event holds
     */
    public statements: Array<UdonCodeStatement> = []
    /**
     * Parse a {@link UdonCodeEvent} from `content`
     * @param content A multiline string that is found between `.code_start` and `.code_end`
     * @returns A {@link UdonCodeEvent}
     * @throws Parsing Error
     */
    public static parse(content: string)
    {
        const events: Array<UdonCodeEvent> = []

        const lines = getLines(content)

        let eName: string | undefined = undefined
        let eStatements: Array<UdonCodeStatement> = []
        for(let i = 0;i < lines.length;i++)
        {
            const line = lines[i]
            let tline = line.trim()
            if(tline.startsWith("#"))
                continue
            if(tline.includes("#"))
                tline = tline.substring(0,tline.indexOf("#"))
            if(tline.length === 0)
                continue
            if(tline.startsWith(".export"))
            {
                newEvent()
                continue
            }
            if(tline.endsWith(":"))
            {
                newEvent()
                eName = tline.substring(0,tline.indexOf(":"))
                continue
            }
            const statement = parseStatement()
            if(typeof statement != "undefined")
            {
                eStatements.push(statement)
                continue
            }

            throw new Error(`invalid line "${tline}"`)

            function parseStatement()
            {
                if(typeof eName == "undefined")
                    return
                for(const [statementName,Statement] of Object.entries(STATEMENTS))
                {
                    if(tline.startsWith(statementName))
                    {
                        return Statement.parse(tline)
                    }
                }
            }
        }
        newEvent()

        return events

        function newEvent()
        {
            if(typeof eName == "string" && eStatements.length > 0)
            {
                const event = new UdonCodeEvent(eName)
                event.statements.push(...eStatements)
                events.push(event)
                eName = undefined, eStatements = []
            }
        }
    }
    /**
     * Create a new Udon Event code block
     * @param name The name of the symbol. Built-in events start with an underscore
     */
    public constructor(public name: string)
    {
        
    }
    /**
     * Add a {@link UdonCodeStatement} to the code
     * @param statement A code statement
     * @returns this
     */
    public addStatement(statement: UdonCodeStatement)
    {
        this.statements.push(statement)
        return this
    }
    /**
     * This opcode does nothing. There is generally no reason to use this, unless you get the `Address aliasing detected:` error.
     * 
     * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#nop Reference}
     */
    public addNoOperationStatement()
    {
        return this.addStatement(new NoOperationUdonCodeStatement)
    }
    /**
     * This opcode pushes an integer to the top of the stack.
     * 
     * Udon Assembly may give the impression that a value is being pushed; this is not the case.
     * 
     * In these cases, it is the heap address that is being pushed.
     * 
     * Unless you are very dedicated to size-optimizing your Udon programs (even at the expense of runtime speed in some cases), or trying to obfuscate, there is never any reason to use this in a conditional fashion. Simply push everything immediately before `EXTERN`, `COPY` or `JUMP_IF_FALSE`.
     * 
     * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#push-parameter Reference}
     * @param value Value to push
     */
    public addPushStatement(value: string)
    {
        return this.addStatement(new PushUdonCodeStatement(value))
    }
    /**
     * This opcode removes the top integer from the stack, with no further effects.
     * 
     * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#pop Reference}
     */
    public addPopStatement()
    {
        return this.addStatement(new PopUdonCodeStatement)
    }
    /**
     * Pops a heap index from the stack and reads a `SystemBoolean` from it.
     * 
     * If this value is `false`, jumps to the parameter as a bytecode position. Otherwise, continues to the next instruction.
     * 
     * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#jump_if_false-parameter Reference}
     * @param position Position to jump to
     */
    public addJumpIfFalseStatement(position: string)
    {
        return this.addStatement(new JumpIfFalseUdonCodeStatement(position))
    }
    /**
     * Jumps to the bytecode position given by the parameter.
     * 
     * `JUMP, 0xFFFFFFFC` is also used to end execution (i.e. return from Udon code).
     * 
     * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#jump-parameter Reference}
     * @param position Position to jump to
     */
    public addJumpStatement(position: string)
    {
        return this.addStatement(new JumpUdonCodeStatement(position))
    }
    /**
     * This opcode is how Udon performs any useful operation whatsoever.
     * 
     * The first thing to note is that the parameter is a heap index, initially containing the extern name (as a string), _but this is also written to._
     * 
     * As an optimization, Udon caches information about the extern after it is first run in the given heap index. These values are still heap values and can be copied.
     * 
     * The parameters to the extern are given in `PUSH` order; that is, the first value pushed is the first argument.
     * 
     * These heap values are read for normal (i.e. `in`) arguments, read and written for `ref` arguments, and written for `out` arguments.
     * 
     * If the extern is not static (i.e. if it has a `this` argument), the `this` argument is added at the start. If there is a return value (i.e. the return type is not `SystemVoid`), it is treated like an `out` argument at the end.
     * 
     * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#extern-parameter Reference}
     * @param reference A extern reference
     */
    public addExternStatement(reference: ExternReference)
    {
        return this.addStatement(new ExternUdonCodeStatement(reference))
    }
    /**
     * This is effectively a "long NOP". The parameter is ignored
     * 
     * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#annotation-parameter Reference}
     * @param parameter Unused
     */
    public addAnnotationStatement(parameter: string)
    {
        return this.addStatement(new AnnotationUdonCodeStatement(parameter))
    }
    /**
     * Gets a heap index from the parameter and reads a `SystemUInt32` from it.
     * 
     * Interprets this as a bytecode position and jumps to it.
     * 
     * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#jump_indirect-parameter Reference}
     * @param index Index from heap
     */
    public addJumpIndirectStatement(index: string)
    {
        return this.addStatement(new JumpIndirectUdonCodeStatement(index))
    }
    /**
     * Pops two heap indexes. The value from the second heap index popped (aka the first heap index pushed) is copied to the first heap index popped (aka the second heap index pushed).
     * 
     * {@link https://creators.vrchat.com/worlds/udon/vm-and-assembly/#copy Reference}
     */
    public addCopyStatement()
    {
        return this.addStatement(new CopyUdonCodeStatement)
    }
    /**
     * Check if this event is a built-in event (Unity/VRChat Events). They start with an underscore
     * @returns true if the event is a built-in event, otherwise false
     */
    public isBuiltIn()
    {
        return this.name.startsWith("_")
    }
    public toString()
    {
        return [
            `    ${this.name}:`,
            ...this.statements
            .map((statement) => "        " + statement.toString())
        ].join("\n")
    }
}