export default interface ComponentContext {
  render(): void,
  [key: string]: any
}