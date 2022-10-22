const Props = Symbol.for('props')

export default function Prop(options: any) {
  return function (target: any, name: string) {
    target[Props] = target[Props] ?? {}
    target[Props][name] = options ?? {}
  }
}