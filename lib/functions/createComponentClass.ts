import ComponentContext from '../types/ComponentContext'

import createProps from './createProps'
import transform from './transform'

type ComponentMetadata = {
  props: object,
  refs: string[],
  events: object
}

export default function createComponent (com: Component) {
  return class extends HTMLElement {
    private metadata: ComponentMetadata
    private context: ComponentContext

    constructor() {
      super()

      // Metadata
      this.metadata = {
        props: com[Symbol.for('props')],
        refs: com[Symbol.for('refs')],
        events: com[Symbol.for('events')]
      }

      // Set props
      this.props = createProps(this, this.render)

      // Set content
      this.content = this.innerHTML

      // Create context
      this.context = new Proxy({
        ...this.props,
        render: this.render
      }, {
        get(target, key) {

        },
        set(target, key, value) {
          
        }
      })
      
      // Call hook onCreate
      com.onCreate?.bind(this.context)()
    }

    // Lifecycle hooks
    connectedCallback() {
      this.render()
      
      com.onMount?.bind(this.context)()
    }
    adoptedCallback() {
      com.onAdopt?.bind(this.context)()
    }
    disconnectedCallback() {
      com.onDestroy?.bind(this.context)()
    }

    // Getting methods/props
    getValue(name: string): any {
      // Dont return prohibited values
      const prohibited = [
        'template', 'onCreate', 'onMount', 'onDestroy', 'onAdopt'
      ]
      if(prohibited.includes(name)) return undefined

      // Return value
      return com[name]
    }

    // Event emitting
    emit(eventName: string, arg: any, bubble: boolean = false) {
      
    }

    // Rendering
    public content: string
    private render() {
      // Build template and use it
      let template = com.template?.bind(this.context)()
      let templateFragment = document.createElement('div')
      templateFragment.innerHTML = template

      // Walk to execute (Directives, events, etc)
      const walk = (parent: HTMLElement) => {
        for(let child of parent.children) {
          transform(com, this, child)
          walk(child)
        }
      }
      walk(templateFragment)

      // Paste frgament into DOM
      this.innerHTML = templateFragment.innerHTML
    }
  }
}