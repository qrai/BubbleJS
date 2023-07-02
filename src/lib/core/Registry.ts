import { randomstr } from '../functions/uuid'
import Directive from '../types/Directive.type'
import View from '../types/View.type'

type SubscriberEvent = 'componentadded' | 'viewadded' | 'directiveadded'
type SubscriberListener = (name: string) => void

class Registry {
  private subscribers: Record<SubscriberEvent, SubscriberListener[]> = {
    'componentadded': [],
    'viewadded': [],
    'directiveadded': []
  }
  public addEventListener(defineEvent: SubscriberEvent, listener: SubscriberListener) {
    this.subscribers[defineEvent].push(listener)
  }
  public removeEventListener(defineEvent: SubscriberEvent, listener: SubscriberListener) {
    this.subscribers[defineEvent] = this.subscribers[defineEvent].filter(_listener => _listener !== listener)
  }
  private emit(event: SubscriberEvent, name: string) {
    this.subscribers[event].forEach(subscriber => subscriber(name))
  }

  private style: HTMLElement | null = null
  public defineStyle(origin: string, css: string) {
    if(!this.style) {
      let style = document.createElement('style')
      document.querySelector('head')?.appendChild(style)
      this.style = style
    }

    this.style.innerText += `/* ORIGIN:${origin} */\n${css}`
  }
  
  private components: Record<string, any> = {}
  public tryDefineComponent(name: string, classDefinition: any): boolean {
    if(this.components[name]) {
      return false
    }
    
    // Add to registry
    this.components[name] = classDefinition
    // Define custom element
    customElements.define(name, classDefinition)
    return true
  }
  public defineComponent(name: string, classDefinition: any) {
    if(this.components[name]) {
      throw new Error(`Failed to define component <${name}> in registry, component with same name is already existed`)
    }
    
    // Add to registry
    this.components[name] = classDefinition

    // Define custom element
    customElements.define(name, classDefinition)
    console.log(`Successfully defined <${name}> component`)

    // Emit event
    this.emit('componentadded', name)
  }

  private directives: Record<string, Directive> = {}
  public defineDirective(name: string, directive: Directive) {
    if(this.directives[name]) {
        throw new Error(`Failed to define directive --${name} in registry, directive with same name is already existed`)
    }
    
    // Add to registry
    this.directives[name] = directive

    // Emit event
    this.emit('directiveadded', name)
  }
  public getDirective(name: string): Directive | undefined {
    return this.directives[name]
  }

  private views: Record<string, View> = {}
  public defineView(route: string, classDefinition: any): boolean {
    const viewName = `view-${randomstr(6)}`

    // Define view
    this.views[route] = { name: viewName, definition: classDefinition }

    // Emit event
    this.emit('viewadded', route)

    // Define component
    return this.tryDefineComponent(viewName, classDefinition)
  }
  public getView(path: string): View | undefined {
    for(const routePath in this.views) {
      if(this.compareMatch(routePath, path)) return this.views[routePath]
    }

    return undefined
  }
  public compareMatch(routePath: string, toComparePath: string) {
    //TODO: match by regex
    return routePath === toComparePath
  }
}

// Define global registry
(window as any).$registry = new Registry()

export default (window as any).$registry as Registry