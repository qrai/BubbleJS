import { Refs } from "../types/ComponentType.type"

export default function MapRef<T>(mapper: (val: T) => T) {
  return function (target: any, propertyKey: string) {
    target[Refs] = target[Refs] ?? {}
    target[Refs][propertyKey] = {
      set(key: string, newVal: T) {
        return mapper(newVal)
      }
    }
  }
}

/* TS5 Implementation:
export default function MapRef<T>(watcher?: (oldVal: T, newVal: T) => void) {
  return function <T extends any>(value: T, ctx: ClassFieldDecoratorContext) {
    console.log('watchref', value, ctx);
    ctx.addInitializer(function (this: any) {
      this[Refs] = this[Refs] ?? {}
      this[Refs][ctx.name] = watcher ?? null
    })
  }
}
*/