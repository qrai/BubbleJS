import HtmlTemplate from "../types/HtmlTemplate.type"
import ComponentCompiler from "./ComponentCompiler"

const ComponentPublicFunctions: string[] = [
  'render', 'emit'
]
const ComponentPrivateFunctions: string[] = [
  'template',
  'onBeforeMount', 'onMount', 'onBeforeUpdate', 'onUpdate', 'onAdopt', 'onDestroy'
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
type CustomEmitOptions = {
  bubbles: boolean,
  composed: boolean,
  cancelable?: boolean,
  detail?: any
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
          return target[key].bind(this)
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
  onBeforeUpdate?(): void
  onUpdate?(): void
  onAdopt?(): void
  onDestroy?(): void

  // Functionality
  private isolateRender(node: HTMLElement | ShadowRoot, interactive: boolean = true) {
    // Get HTML template
    let template: HtmlTemplate = this.template.bind(this.__state)()
    let style: string | undefined = this.styles?.bind(this.__state)()

    // Reset
    node.innerHTML = ''

    // Add style
    if(style) node.innerHTML += `<style scoped>${style}</style>`

    // Compile template
    const compiler = new ComponentCompiler(this)
    node.append(...compiler.compile({
      template,
      content: this.__content,
      state: this.__state
    }, interactive))

    return node
  }
  public render() {
    // Clone root node and apply changes
    const rootCopy: HTMLElement = this.isolateRender(document.createElement('div'), false) as HTMLElement

    // Clone original root (current)
    const originalRootCopy = document.createElement('div')
    originalRootCopy.innerHTML = this.__root.innerHTML

    // Compare content of changed and nonchanged roots
    if(rootCopy.isEqualNode(originalRootCopy) === false) {
      // Call before update hook
      this.onBeforeUpdate?.bind(this.__state)()
      // Do update DOM
      this.isolateRender(this.__root)
      // Call after update hook
      this.onUpdate?.bind(this.__state)()

      // Clear up copies
      rootCopy.remove()
      originalRootCopy.remove()
    }

    //TODO: do requestAnimationFrame for perfomant rendering without freezing
  }

  emit(eventName: string, options: CustomEmitOptions = {
    composed: true,
    bubbles: true
  }) {
    this.__root.dispatchEvent(new CustomEvent(eventName, options))
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