import type { ExternUdonCodeStatement } from "./asm/code/ops/extern"
import { stripUdonType } from "./utilities"

/**
 * Represents a extern reference, used in {@link ExternUdonCodeStatement}
 */
export class ExternReference
{
    /**
     * The argument types of this extern reference
     */
    public arguments: Array<string>
    /**
     * Parse a {@link ExternReference} from a string
     * @param line A string
     * @returns A {@link ExternReference}
     * @throws Parsing Error
     */
    public static parse(line: string)
    {
        const tline = line.trim()
        const seperator = tline.indexOf(".")
        if(seperator === -1)
            throw new Error("couldn't find method signature")
        const namespace = tline.substring(0,seperator)
        let rest = tline.substring(seperator+1)
        const name = rest.substring(rest.indexOf("__")+2,rest.indexOf("__",2))
        if(name.length === 0)
            throw new Error("invalid name for extern reference")
        rest = rest.replace(`__${name}__`,"")
        const returnType = rest.substring(rest.lastIndexOf("__")+2)
        if(returnType.length === 0)
            throw new Error("no return type found")
        rest = rest.replace(`__${returnType}`,"")
        const args = rest.split("_")
        return new this(namespace,name,returnType,...args)
    }
    /**
     * Create a {@link ExternReference}
     * @param namespace The namespace of the extern reference
     * @param name The name of the extern reference
     * @param returnType The return type of the extern reference
     * @param args The arguments of the extern reference
     */
    public constructor(public namespace: string,public name: string,public returnType: string,...args: Array<string>)
    {
        this.arguments = args.map(stripUdonType)
    }
    /**
     * Build the string representation of this extern reference
     */
    public build()
    {
        if(this.arguments.length > 0)
            return `${stripUdonType(this.namespace)}.__${stripUdonType(this.name)}__${this.arguments.map(stripUdonType).join("_")}__${stripUdonType(this.returnType)}`
        return `${stripUdonType(this.namespace)}.__${stripUdonType(this.name)}__${stripUdonType(this.returnType)}`
    }
}

export namespace ExternReference
{
    /**
     * Default return type of extern references
     */
    export const DEFAULT_RETURN_TYPE = "SystemVoid"
    /**
     * A convenient Builder for creating {@link ExternReference}
     */
    export class Builder
    {
        private _namespace?: string
        private _name?: string
        private _return_type: string = DEFAULT_RETURN_TYPE
        private _args: Array<string> = []
        /**
         * Set the namespace
         * @param namespace The namespace of the extern reference
         * @returns this
         */
        public setNamespace(namespace: string)
        {
            this._namespace = stripUdonType(namespace)
            return this
        }
        /**
         * Set the name
         * @param name The name of the extern reference
         * @returns this
         */
        public setName(name: string)
        {
            this._name = stripUdonType(name)
            return this
        }
        /**
         * Set the return type, optional
         * @param returnType The return type of the extern reference
         * @returns this
         */
        public setReturnType(returnType: string)
        {
            this._return_type = stripUdonType(returnType)
            return this
        }
        /**
         * Add an required argument
         * @param arg A argument type
         * @returns this
         */
        public addArgument(arg: string)
        {
            this._args.push(stripUdonType(arg))
            return this
        }
        /**
         * Create a {@link ExternReference} from the set values
         * @returns A {@link ExternReference}
         * @throws If namespace and name hasn't been set
         */
        public build()
        {
            if(typeof this._namespace != "string")
                throw new Error("no namespace specified")
            if(typeof this._name != "string")
                throw new Error("no name specified")
            return new ExternReference(this._namespace,this._name,this._return_type,...this._args)
        }
    }
}