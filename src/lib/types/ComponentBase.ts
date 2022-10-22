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

export default abstract class ComponentBase extends HTMLElement {
  protected content: string
  protected state: any

  constructor() {
    super()

    this.content = this.innerHTML

    this.state = new Proxy(this, {
      get: (target: any, key: string) => {
        // render(), emit() functions
        if(ComponentPublicFunctions.includes(key)) { return target[key] }
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
        // Attribute
        if(target.hasAttribute(key)) {
          target.setAttribute(key, value)
          return true
        }
        // Ref
        else if(target[ComponentRefs]?.includes(key) && key in target) {
          target[key] = value
          this.render()
          return true
        }

        return false
      }
    })
  }

  // Component HTML & CSS
  abstract template(): string
  styles?(): string

  // Hooks
  onBeforeMount?(): void
  onMount?(): void
  onAdopt?(): void
  onDestroy?(): void

  // Functionality
  render() {
    // Get HTML template
    let template = this.template.bind(this.state)()

    // Compile template
    //TODO: do DOM diffing for perfomant rendering
    //TODO: do requestAnimationFrame for perfomant rendering
    this.innerHTML = ''
    this.append(...Template.compile(this, {
      template,
      content: this.content,
      state: this.state
    }))
  }
  emit() {

  }

  // Using callbacks
  connectedCallback() {
    this.onBeforeMount?.()
    this.render()
    this.onMount?.()
  }
}