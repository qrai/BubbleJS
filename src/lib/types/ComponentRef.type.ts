export type CachingStrategy = "temporal" | "session" | "storage"

export default interface ComponentRef<T> {
    init?: (key: string) => T
    get?: (key: string) => T
    set?: (key: string, val: T, oldVal: T) => T
}