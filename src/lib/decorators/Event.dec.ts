const Events = Symbol.for('events')

export default function Event(target: any, name: string) {
  target[Events] = target[Events] ?? {}
  target[Events][name] = {}
}