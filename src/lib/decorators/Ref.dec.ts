import ComponentRef from "../types/ComponentRef.type"
import { Refs } from "../types/ComponentType.type"

export default function Ref<T>(opts?: ComponentRef<T>) {
  return function (target: any, propertyKey: string) {
    target[Refs] = target[Refs] ?? {}
    target[Refs][propertyKey] = opts ?? {}
  }
}

/* TS5 Implementation:
export default function Ref(value: any, ctx: ClassFieldDecoratorContext) {
  ctx.addInitializer(function (this: any) {
    this[Refs] = this[Refs] ?? {}
    this[Refs][ctx.name] = null
  })
}
*/