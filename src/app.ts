import { ComponentBase, Component, Prop, Ref, Registry, html } from './lib/bubble'

// --html directive
Registry.defineDirective('html', (el: HTMLElement, value: any) => {
  el.innerHTML = typeof value === 'string' ? value : value.raw ?? ''
})

function useRef(val: any): { value: any } {
  return { value: null }
}

@Component('my-button')
class MyButton extends ComponentBase {
  template() {
    return html`
      <button>
        <span --html="$hi"></span>
      </button>
    `
  }

  styles() {
    return /*css*/`
      button {
        padding: 8px 20px;

        background: blue;
        color: white;

        border: none;
        border-radius: 10px;
        outline: none;

        cursor: pointer;

        font-size: 14px;
      }
    `
  }
}