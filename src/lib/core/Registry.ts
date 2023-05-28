import Directive from '../types/Directive.type'

class Registry {
  private style: HTMLElement | null = null
  public defineStyle(origin: string, css: string) {
    if(!this.style) {
      let style = document.createElement('style')
      document.querySelector('head')?.appendChild(style)
      this.style = style
    }

    this.style.innerText += `/* ORIGIN:${origin} */\n${css}`
  }
  
  private components: { [key: string]: any } = {}
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
  }

  private directives: { [key: string]: Directive } = {}
  public defineDirective(name: string, directive: Directive) {
    if(this.directives[name]) {
        throw new Error(`Failed to define directive --${name} in registry, directive with same name is already existed`)
    }
    
    // Add to registry
    this.directives[name] = directive
  }
  public getDirective(name: string): Directive | undefined {
    return this.directives[name]
  }
}

export default new Registry()