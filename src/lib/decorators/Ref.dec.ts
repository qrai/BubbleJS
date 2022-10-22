const Refs = Symbol.for('refs')

export default function Ref(target: any, propertyKey: string): void {
  target[Refs] = target[Refs] ?? []
  target[Refs].push(propertyKey)
}