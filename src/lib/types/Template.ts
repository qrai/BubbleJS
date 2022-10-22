import ComponentBase from "./ComponentBase";
import Directive from "./Directive";
import Registry from "./Registry";

function getAsCondition(value: string): boolean {
  return value.length > 0 && value !== 'false' && value !== '[]'
}
function getAsFunction(value: string): Function | null {
  if(value.startsWith('function')) {
    return new Function('return ' + value)
  }
  else if(value.startsWith('(')) {
    return new Function('return void 0')
  }

  return null
}

function compileNode(component: ComponentBase, node: any, params: TemplateParams) {
  // Walk every attribute
  for(let attr of [...node.attributes]) {
    const { name, value } = attr

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
      for(let attr of component.attributes) {
        node.setAttribute(attr.name, attr.value)
      }
    }
    // Conditional node
    else if(name === '--if') {
      let condition: boolean = getAsCondition(value)

      // Hide if not met condition (else branch visible)
      if(!condition) { node.style.display = 'none' }

      // Else block
      let nextEl = node.nextSibling
      if(nextEl && nextEl.nodeType === 1 && nextEl.hasAttribute('--else')) {
        nextEl.removeAttribute('--else')
        // Hide if met condition (if branch visible)
        if(condition) { node.style.display = 'none' }
      }
    }
    // Conditional attribute
    else if(name.endsWith(':if')) {
      let attr: string = name.replace(':if', '')
      
      // Add attribute if condition met
      if(getAsCondition(value)) {
        node.setAttribute(attr, '')
      }
    }
    // Directive
    else if(name.startsWith('--')) {
      let directive: Directive | undefined = Registry.getDirective(name.replace('--', ''))
      if(!directive) {
        console.error(`Directive ${name} was not defined in registry`)
      }

      // Call directive
      directive?.(node, value)
    }
    // Passing prop/method/etc to property
    else if(name.startsWith(':')) {
      let prop: string = name.replace(':', '')
      let propValue: any = params.state[value]

      if(propValue === undefined) {
        throw new Error(`Invalid property value for ${name}, "${value}" was undefined`)
      }

      // Set as property
      if(node[prop]) {
        node[prop] = propValue
      }
      else if(typeof propValue === 'string') {
        node.setAttribute(prop, propValue)
      }
    }
    // Event listener
    else if(name.startsWith('@')) {
      let event: string = name.replace('@', '')
      //let actualFunction = getAsFunction(value)
      let listener: any = params.state[value]

      if(typeof listener !== 'function') {
        throw new Error(`Invalid event listener for ${name} event, "${value}" was not a function (${typeof listener})`)
      }
      
      // Add event listener
      node[`on${event}`] = (e: any) => listener.bind(params.state)(e)
    }
    else {
      return
    }

    // Remove
    node.removeAttribute(name)
  }
}

type TemplateParams = {
  template: string,
  content: string,
  state: any
}
export default class Template {
  static compile(component: ComponentBase, params: TemplateParams): HTMLCollection {
    // Create fragment and paste template
    let fragEl = document.createElement('div')
    fragEl.innerHTML = params.template

    // Walk every node
    const walk = (parent: Element) => {
      for(let child of parent.children) {
        compileNode(component, child, params)
        walk(child)
      }
    }
    walk(fragEl)

    return fragEl.children
  }
}