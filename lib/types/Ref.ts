const Refs = Symbol.for('refs')

export default function Ref(options: any) {
  return function (target: any, name: string) {
    target[Refs] = target[Refs] ?? []
    target[Refs].push(name)
  }
}