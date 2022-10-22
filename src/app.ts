import { ComponentBase, Component, Prop, Ref, html } from './lib/bubble'

@Component('my-button')
class MyButton extends ComponentBase {
  @Ref
  public count: number = 0
  
  template() {
    return html`
    <button disabled:if="${this.count > 10}" @click="onClick">
      <my-span variant="dark">
        Count ${this.count}
      </my-span>
    </button>
    `
  }

  onClick() {
    this.count++
  }
}