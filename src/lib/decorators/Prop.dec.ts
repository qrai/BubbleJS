import ComponentProp from "../types/ComponentProp.type"
import { Props } from "../types/ComponentType.type"

export default function Prop(options?: ComponentProp) {
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