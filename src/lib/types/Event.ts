const Events = Symbol.for('events')

export default function Event(options: any) {
  return function (target: any, name: string) {
    target[Events] = target[Events] ?? {}
    target[Events][name] = options ?? {}
  }
}