import { Elements } from "../types/ComponentType.type"

export default function Element(query: string) {
  return function (target: any, propertyKey: string) {
    target[Elements] = target[Elements] ?? {}
    target[Elements][propertyKey] = { query }
  }
}