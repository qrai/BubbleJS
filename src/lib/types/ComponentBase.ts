import HtmlTemplate from "./HtmlTemplate"
import Template from "./Template"

const ComponentPublicFunctions: string[] = [
  'render', 'emit'
]
const ComponentPrivateFunctions: string[] = [
  'template',
  'onBeforeMount', 'onMount', 'onAdopt', 'onDestroy'
]
const ComponentProps: symbol = Symbol.for('props')
const ComponentRefs: symbol = Symbol.for('refs')
const ComponentEvents: symbol = Symbol.for('events')

type EmitOptions = {
  bubbling: boolean
}
type EmitFunction = {
  (data?: any, options?: EmitOptions): any
}

export default abstract class ComponentBase extends HTMLElement {
  protected __content: string
  protected __root: ShadowRoot
  protected __state: any

  constructor() {
    super()

    this.__content = this.innerHTML
    this.innerHTML = ''

    this.__root = this.attachShadow({ mode: 'closed' })

    this.__state = new Proxy(this, {
      get: (target: any, key: string) => {
        // render(), emit() functions
        if(ComponentPublicFunctions.includes(key)) {
          return target[key]
        }
        // Attribute
        else if(target.hasAttribute(key)) { return target.getAttribute(key) }
        // Prop
        else if(target[ComponentProps]?.[key] && key in target) {
          return target[key]
        }
        // Ref
        else if(target[ComponentRefs]?.includes(key) && key in target) {
          return target[key]
        }
        // Method
        else if(key in target && typeof target[key] === 'function') {
          return ComponentPrivateFunctions.includes(key) ? undefined : target[key]
        }
      },
      set: (target: any, key: string, value: any) => {
        // Prop
        if(target[ComponentProps]?.[key] && key in target && value?._from === 'outside') {
          target[key] = value.value
          this.render()
          return true
        }
        // Ref
        else if(target[ComponentRefs]?.includes(key) && key in target) {
          target[key] = value
          this.render()
          return true
        }
        // Attribute
        else if(target.hasAttribute(key)) {
          target.setAttribute(key, value)
          return true
        }

        return false
      }
    })
  }

  // Component HTML & CSS
  abstract template(): HtmlTemplate
  styles?(): string

  // Hooks
  onBeforeMount?(): void
  onMount?(): void
  onAdopt?(): void
  onDestroy?(): void

  // Functionality
  render() {
    // Get HTML template
    let template: HtmlTemplate = this.template.bind(this.__state)()
    let style: string | undefined = this.styles?.bind(this.__state)()

    // Compile template
    //TODO: do DOM diffing for perfomant rendering
    //TODO: do requestAnimationFrame for perfomant rendering
    this.__root.innerHTML = ''
    if(style) this.__root.innerHTML += `<style scoped>${style}</style>`
    this.__root.append(...Template.compile(this, {
      template,
      content: this.__content,
      state: this.__state
    }))
  }
  emit(eventName: string): EmitFunction {
    const event: Event = new Event(eventName)

    // Return emitter function
    return (data?: any, options?: EmitOptions) => {
      this.dispatchEvent(event)
    }
  }
  setProperty(name: string, value: any) {
    console.trace()
    this.__state[name] = { _from: 'outside', value }
  }

  // Using callbacks
  connectedCallback() {
    this.onBeforeMount?.bind(this.__state)()
    this.render()
    this.onMount?.bind(this.__state)()
  }
  disconnectedCallback() {
    this.onDestroy?.bind(this.__state)()
  }
}