import Registry from "../core/Registry"

export default function Component(name: string) {
  return function (target: any) {
    Registry.tryDefineComponent(name, target)
  }
}

/* TS5 Implementation:
type Constructor<T = {}> = new (...args: any[]) => T;
export default function Component(name: string) {
  return function <T extends Constructor>(value: T, ctx: ClassDecoratorContext<T>) {
    Registry.tryDefineComponent(name, value)
    return value;
  };
}
*/