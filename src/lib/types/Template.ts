import ComponentBase from "./ComponentBase"
import Directive from "./Directive"
import HtmlTemplate from "./HtmlTemplate"
import Registry from "./Registry"

function getValue(name: string, params: TemplateParams) {
  // Non-primitive value
  if(name.startsWith('$')) {
    return params.template.values[name] ?? params.state[name] ?? name
  }
  else {
    return params.state[name] ?? name
  }
}
function getAsCondition(value: string): boolean {
  return value.length > 0 && value !== 'false' && value !== '[]'
}

function getNextNode(node: any) {
  let nextEl = node.nextSibling
  while(nextEl && nextEl.nodeType !== 1) {
    nextEl = nextEl.nextSibling
  }
  return nextEl
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
      if(condition === false) { node.style.display = 'none' }

      // Else block
      let nextEl = getNextNode(node)
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
      let val: any = getValue(value, params)

      // Call directive
      directive?.(node, val)
    }
    // Event listener
    else if(name.startsWith('@')) {
      let event: string = name.replace('@', '')
      let listener: any = getValue(value, params)

      if(typeof listener !== 'function') {
        throw new Error(`Invalid event listener for ${name} event, "${value}" was not a function (${typeof listener})`)
      }
      
      // Add event listener
      node[`on${event}`] = (e: any) => listener.bind(params.state)(e)
    }
    // Passing non-primitive value to property
    else if(value.startsWith('$')) {
      let propValue: any = params.template.values[value]

      if((value in params.template.values) === false) {
        throw new Error(`Invalid property value for ${name}, "${value}" was undefined`)
      }

      // Set value
      console.log(`Setting "${name}" of <${node.tagName.toLowerCase()}> to `, propValue)
      node[name] = propValue
    }
    else {
      return
    }

    // Remove
    node.removeAttribute(name)
  }
}

type TemplateParams = {
  template: HtmlTemplate,
  content: string,
  state: any
}
export default class Template {
  static compile(component: ComponentBase, params: TemplateParams): HTMLCollection {
    // Create fragment and paste template
    let fragEl = document.createElement('div')
    fragEl.innerHTML = params.template.raw

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