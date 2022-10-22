import Registry from "../types/Registry"

export default function Component(name: string) {
  return function (target: any) {
    Registry.tryDefineComponent(name, target)
  }
}