import ComponentContext from '../types/ComponentContext'

import createFields from './createFields'
import transform from './transform'

type ComponentMetadata = {
  props: object,
  refs: string[],
  events: object
}

export default function createComponentClass(com: Component) {
  return class extends HTMLElement {
    private base: Component
    private metadata: ComponentMetadata
    public context: ComponentContext

    constructor() {
      super()

      this.base = com

      // Metadata
      this.metadata = {
        props: com[Symbol.for('props')],
        refs: com[Symbol.for('refs')],
        events: com[Symbol.for('events')]
      }

      // Set content
      this.content = this.innerHTML

      // Create context
      let self = this
      this.context = new Proxy({}, {
        get: (target, key) => {
          console.log('GET', key, this.base[key])
          
          // render(), emit() functions
          if(key === 'render' || key === 'emit') { return self[key] }
          // Attribute
          else if(self.hasAttribute(key)) { return self.getAttribute(key) }
          // Prop
          else if(self.metadata.props?.[key]) {
            return target[key] ?? this.base[key] // TODO: get default in meta instead
          }
          // Ref
          else if(self.metadata.refs?.includes(key)) {
            return target[key] ?? this.base[key]
          }
          // Method
          else if(typeof this.base[key] === 'function') {
            let prohibited = [
              'template',
              'onCreate', 'onAmount', 'onAdopt', 'onDestroy'
            ]
            return prohibited.includes(key) ? undefined : this.base[key]
          }
        },
        set: (target, key, value) => {
          // Attribute
          if(self.hasAttribute(key)) {
            self.setAttribute(key, value)
          }
          // Prop
          else if(self.metadata.props?.[key]) {
            target[key] = value
            self.render()
          }
          // Ref
          else if(self.metadata.refs?.includes(key)) {
            target[key] = value
            self.render()
          }
        }
      })
      
      // Call hook onCreate
      this.base.onCreate?.bind(this.context)()
    }

    // Lifecycle hooks
    connectedCallback() {
      this.render()
      
      this.base.onMount?.bind(this.context)()
    }
    adoptedCallback() {
      this.base.onAdopt?.bind(this.context)()
    }
    disconnectedCallback() {
      this.base.onDestroy?.bind(this.context)()
    }

    // Event emitting
    emit(eventName: string, arg: any, bubble: boolean = false) {
      
    }

    // Rendering
    public content: string
    private render() {
      // Build template and use it
      let template = this.base.template?.bind(this.context)()
      let templateFragment = document.createElement('div')
      templateFragment.innerHTML = template

      // Walk to execute (Directives, events, etc)
      const walk = (parent: HTMLElement) => {
        for(let child of parent.children) {
          transform(this, child)
          walk(child)
        }
      }
      walk(templateFragment)

      // Paste frgament into DOM
      this.innerHTML = templateFragment.innerHTML
    }
  }
}