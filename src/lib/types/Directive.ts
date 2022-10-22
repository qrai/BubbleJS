export default interface Directive = {
  (el: HTMLElement, value: any): void
}