const Refs = Symbol.for('refs')

export default function WatchRef<T>(watcher?: (oldVal: T, newVal: T) => void) {
  return function (target: any, propertyKey: string) {
    target[Refs] = target[Refs] ?? {}
    target[Refs][propertyKey] = watcher ?? null
  }
}