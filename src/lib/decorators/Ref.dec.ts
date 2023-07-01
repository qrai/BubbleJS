const Refs = Symbol.for('refs')

export default function Ref(target: any, propertyKey: string) {
  target[Refs] = target[Refs] ?? {}
  target[Refs][propertyKey] = null
}