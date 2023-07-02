const Refs = Symbol.for('refs')

export default function WatchRef<T>(watcher?: (oldVal: T, newVal: T) => void) {
  return function (target: any, propertyKey: string) {
    target[Refs] = target[Refs] ?? {}
    target[Refs][propertyKey] = watcher ?? null
  }
}

/* TS5 Implementation:
export default function WatchRef<T>(watcher?: (oldVal: T, newVal: T) => void) {
  return function <T extends any>(value: T, ctx: ClassFieldDecoratorContext) {
    console.log('watchref', value, ctx);
    ctx.addInitializer(function (this: any) {
      this[Refs] = this[Refs] ?? {}
      this[Refs][ctx.name] = watcher ?? null
    })
  }
}
*/