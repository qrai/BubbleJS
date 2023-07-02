import Cache from "../cache/Cache"
import { CachingStrategy } from "../types/ComponentRef.type"
import { Refs } from "../types/ComponentType.type"

export default function CachedRef<T>(strategy: CachingStrategy) {
  return function (target: any, propertyKey: string) {
    target[Refs] = target[Refs] ?? {}
    target[Refs][propertyKey] = {
      init(key: string) {
        Cache.getItem(
          strategy,
          this.constructor.name + '.' + key
        )
      },
      set(key: string, newValue: T) {
        Cache.setItem(
          target[Refs][key]?.cached as CachingStrategy,
          this.constructor.name + '.' + key,
          newValue
        )
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