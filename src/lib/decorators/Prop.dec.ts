import PropOptions from "../types/PropOptions"

const Props = Symbol.for('props')

export default function Prop(options?: PropOptions) {
  return function (target: any, name: string) {
    target[Props] = target[Props] ?? {}
    target[Props][name] = options ?? {}
  }
}