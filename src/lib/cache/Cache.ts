import { CachingStrategy } from "../types/ComponentRef.type"

export type VarType = 'string' | 'number' | 'bigint' | 'boolean' | 'object'

export default new class Cache {
    public serializeItem(val: any): string {
        // Number | Boolean
        if(typeof val === 'string')
            return val
        else if(typeof val === 'number'
            || typeof val === 'boolean')
            return val.toString()
        // Array | Object
        else if(Array.isArray(val) || typeof val === 'object')
            return JSON.stringify(val)
        else
            return val.toString()
    }
    public unserializeItem(val: string): any {
        // Number
        if(/[0-9]/.test(val))
            return parseInt(val)
        // Float
        else if(/[0-9](\.[0-9])?/.test(val))
            return parseFloat(val)
        // Boolean
        else if(val === 'true')
            return true
        else if(val === 'false')
            return false
        // Array | Object
        else if((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']')))
            return JSON.stringify(val)
        else
            return val
    }

    public setItem<T>(strategy: CachingStrategy, key: string, val: T) {
        if(strategy === 'storage')
            localStorage.setItem(key, this.serializeItem(val))
        else if(strategy === 'session')
            sessionStorage.setItem(key, this.serializeItem(val))
        else if(strategy === 'temporal') {
            (window as any).$cache = (window as any).$cache ?? {};
            (window as any).$cache[key] = val
        }
    }
    public getItem<T>(strategy: CachingStrategy, key: string): T | undefined {
        if(strategy === 'storage')
            return this.unserializeItem(localStorage.getItem(key) ?? '') as any
        else if(strategy === 'session')
            return this.unserializeItem(sessionStorage.getItem(key) ?? '') as any
        else if(strategy === 'temporal') {
            return (window as any).$cache[key] 
        }
    }
}