import { Component, Prop } from '../lib/bubble.ts'

class MySpan extends Component {
  get name() {
    return 'my-span'
  }

  @Prop()
  public variant: string
  
  template() {
    return `
      <template --slot></template>
    `
  }

  style() {
    return `
      my-span {
        background: black;
        color: white;
      }
    `
  }

  onMount() {
    console.log('mount', this.props)
  }
}
Component.define(MySpan)

class MyButton extends Component {
  get name() {
    return 'my-button'
  }

  @Ref
  public count: number = 0
  
  template() {
    return `
    <button --bind @click="onClick">
      <my-span variant="dark">
        Count ${this.count}
      </my-span>
    </button>
    `
  }

  onClick(e) {
    console.log('was click')
  }

  onMount() {
    console.log('mount', this)
  }
}
Component.define(MyButton)