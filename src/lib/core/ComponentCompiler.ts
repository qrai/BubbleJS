import ComponentBase from "./ComponentBase"
import Directive from "../types/Directive.type"
import HtmlTemplate from "../types/HtmlTemplate.type"
import Registry from "./Registry"

type TemplateParams = {
  template: HtmlTemplate,
  content: string,
  state: any
}

export default class ComponentCompiler {
  private _component: ComponentBase
  constructor(component: ComponentBase) {
    this._component = component
  }

  public compile(params: TemplateParams, interactive: boolean = true): HTMLCollection {
    // Create fragment and paste template
    let fragEl = document.createElement('div')
    fragEl.innerHTML = params.template.raw

    // Walk every node
    const walk = (parent: Element) => {
      for(let child of parent.children) {
        this.compileNode(child, params, interactive)
        walk(child)
      }
    }
    walk(fragEl)

    return fragEl.children
  }

  public compileNode(node: Element, params: TemplateParams, interactive: boolean = true) {
    // Walk every attribute
    let len = node.attributes.length;
    for(let i = 0; i < len; i ++) {
      const { name, value } = node.attributes[i]
  
      // Slot pasting
      if(name === '--slot') {
        node.outerHTML = params.content
      }
      else if(name === '--slot-container') {
        node.innerHTML = params.content
      }
      // Props binding
      else if(name === '--bind') {
        // Bind all root attributes to node
        for(let attr of this._component.attributes) {
          node.setAttribute(attr.name, attr.value)
        }
      }
      // Conditional node
      else if(name === '--if') {
        let condition: boolean = this.getAsCondition(value)
  
        // Hide if not met condition (else branch visible)
        if(condition === false) { (node as HTMLElement).style.display = 'none' }
  
        // Else block
        let nextEl = this.getNextNode(node)
        if(nextEl && nextEl.nodeType === 1 && nextEl.hasAttribute('--else')) {
          nextEl.removeAttribute('--else')
          // Hide if met condition (if branch visible)
          if(condition === true) { nextEl.style.display = 'none' }
        }
      }
      // Conditional attribute
      else if(name.endsWith(':if')) {
        let attr: string = name.replace(':if', '')
        
        // Add attribute if condition met
        if(this.getAsCondition(value)) {
          node.setAttribute(attr, '')
        }
      }
      // Directive
      else if(name.startsWith('--')) {
        let directive: Directive | undefined = Registry.getDirective(name.replace('--', ''))
        if(!directive) {
          console.error(`Directive ${name} was not defined in registry`)
        }
        let val: any = this.getValue(value, params)
  
        // Call directive
        directive?.(node as HTMLElement, val)
      }
      // Event listener
      else if(name.startsWith('@') && interactive) {
        let event: string = name.replace('@', '')
        let listener: any = this.getValue(value, params)
  
        if(typeof listener !== 'function') {
          throw new Error(`Invalid event listener for ${name} event, "${value}" was not a function (${typeof listener})`)
        }
  
        console.log(`Added "${event}" event listener on `, node)
  
        // Add event listener
        node.addEventListener(event, (e: Event) => {
          console.log(`Fired "${event}" event on `, node)
          listener.bind(params.state)(e)
        }, false)
      }
      // Passing non-primitive value to property
      else if(value.startsWith('$')) {
        let propValue: any = params.template.values[value]
  
        if((value in params.template.values) === false) {
          throw new Error(`Invalid property value for ${name}, "${value}" was undefined`)
        }
  
        // Pass setting event listeners in non-interactive
        if(name.startsWith('@') && !interactive) {
          return
        }
  
        // Set value
        console.log(`Setting "${name}" of <${node.tagName.toLowerCase()}> to `, propValue);
        (node as any)[name] = propValue;
      }
    }
  }

  private getValue(name: string, params: TemplateParams) {
    // Non-primitive value
    if(name.startsWith('$')) {
      return params.template.values[name] ?? params.state[name] ?? name
    }
    else {
      return params.state[name] ?? name
    }
  }

  private getAsCondition(value: string): boolean {
    return value.length > 0 && value !== 'false' && value !== '[]'
  }
  
  private getNextNode(node: any) {
    let nextEl = node.nextSibling
    while(nextEl && nextEl.nodeType !== 1) {
      nextEl = nextEl.nextSibling
    }
    return nextEl
  }
}