import Registry from "../core/Registry"

export default function View(path: string) {
  return function (target: any) {
    Registry.defineView(path, target)
  }
}

/* TS5 Implementation:
type Constructor<T = {}> = new (...args: any[]) => T;
export default function View(name: string) {
  return function <T extends Constructor>(value: T, ctx: ClassDecoratorContext<T>) {
    Registry.defineView(name, value)
    return value;
  };
}
*/