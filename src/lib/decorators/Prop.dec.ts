import PropOptions from "../types/PropOptions.type"

const Props = Symbol.for('props')

export default function Prop(options?: PropOptions) {
  return function (target: any, name: string) {
    target[Props] = target[Props] ?? {}
    target[Props][name] = options ?? {}
  }
}

/* TS5 Implementation:
export default function Prop(options?: PropOptions) {
  return function(value: any, ctx: ClassFieldDecoratorContext) {
    value[Props] = value[Props] ?? {}
    value[Props][ctx.name] = options ?? {}
  }
}
*/