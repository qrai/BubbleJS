const Refs = Symbol.for('refs')

export default function Ref(target: any, propertyKey: string) {
  target[Refs] = target[Refs] ?? {}
  target[Refs][propertyKey] = null
}

/* TS5 Implementation:
export default function Ref(value: any, ctx: ClassFieldDecoratorContext) {
  ctx.addInitializer(function (this: any) {
    this[Refs] = this[Refs] ?? {}
    this[Refs][ctx.name] = null
  })
}
*/