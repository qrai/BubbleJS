import { Elements, Props, Refs } from "../types/ComponentType.type"
import HtmlTemplate from "../types/HtmlTemplate.type"
import ComponentCompiler from "./ComponentCompiler"

const ComponentPublicFunctions: string[] = [
  'render', 'emit'
]
const ComponentPrivateFunctions: string[] = [
  'template',
  'onBeforeMount', 'onMount', 'onBeforeUpdate', 'onUpdate', 'onAdopt', 'onDestroy'
]

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

    // TODO: Add changes watching to refs that is Array/Object type
    // arrayRef.push(1) is not rerenders
    // objectRef.prop = 1 is not rerenders

    this.__content = this.innerHTML
    this.innerHTML = ''

    this.__root = this.attachShadow({ mode: 'closed' })

    this.__state = new Proxy(this, {
      get: (target: any, key: string) => {
        // render(), emit() functions
        if(ComponentPublicFunctions.includes(key)) {
          return target[key].bind(this)
        }
        // Prop
        else if(target[Props]?.[key] && key in target) {
          return target[key]
        }
        // Ref
        else if(target[Refs]?.[key] !== undefined && key in target) {
          // Ref getter
          if(target[Refs][key]?.get !== undefined) {
            return target[Refs][key]?.get.bind(this.__state)(key)
          }

          return target[key]
        }
        // Element
        else if(target[Elements]?.[key] !== undefined) {
          return this.__root.querySelector(target[Elements][key].query)
        }
        // Method
        else if(key in target && typeof target[key] === 'function') {
          return ComponentPrivateFunctions.includes(key) ? undefined : target[key]
        }
        // Attribute
        else if(target.hasAttribute(key)) {
          return target.getAttribute(key)
        }
      },
      set: (target: any, key: string, value: any) => {
        // Prop
        if(target[Props]?.[key] && key in target && value?._from === 'outside') {
          target[key] = value.value
          this.render()
          return true
        }
        // Ref
        else if(target[Refs]?.[key] !== undefined && key in target) {
          const oldValue = target[key]
          let newValue = value

          // Ref setter
          if(target[Refs][key]?.set !== undefined)
            newValue = target[Refs][key]?.set?.bind(this.__state)(newValue)

          // Change value & rerender
          target[key] = newValue
          this.render()

          return true
        }
        // Attribute
        else if(target.hasAttribute(key)) {
          target.setAttribute(key, value)
          return true
        }

        console.log(key, target[Refs])

        return false
      },
      ownKeys(target: any) {
        return [
          ...target[Props] ?? [],
          ...Object.keys(target[Refs] ?? []),
          ...ComponentPublicFunctions,
          //TODO: methods, attributes
        ]
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

  // Caching
  private initRefs() {
    for(const refKey in (this as any)[Refs]) {
      const refOptions = (this as any)[Refs][refKey];

      if(refOptions?.init !== undefined) {
        const refInitted = refOptions?.init.bind(this.__state)(refKey)
        
        if(refInitted) (this as any)[refKey] = refInitted
      }
    }
  }
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
    this.initRefs()
    this.onBeforeMount?.bind(this.__state)()
    this.render()
    this.onMount?.bind(this.__state)()
  }
  disconnectedCallback() {
    this.onDestroy?.bind(this.__state)()
  }
}