import Registry from '../types/Registry'
import Directive from '../types/Directive'

// Transform functional DOMElement inside component
export default function transform(com: any, comEl: HTMLElement, node: HTMLElement) {
  // Walk every attribute
  for(let attr of [...node.attributes]) {
    const { name, value } = attr

    // Slot pasting
    if(name === '--slot') {
      node.outerHTML = comEl.content
    }
    else if(name === '--slot-container') {
      node.innerHTML = comEl.content
    }
    // Props binding
    else if(name === '--bind') {
      // Bind all root attributes to node
      for(let attr of comEl.attributes) {
        node.setAttribute(attr.name, attr.value)
      }
    }
    // Directive
    else if(name.startsWith('--')) {
      let directive: Directive | undefined = Registry.getDirective(name.replace('--', ''))
      if(!directive) {
        console.error(`Directive ${name} was not defined in registry`)
      }

      // Call directive
      directive(node, value)
    }
    // Passing prop/method/etc to property
    else if(name.startsWith(':')) {
      let prop: string = name.replace(':', '')
      let propValue: any = comEl.getValue(value)

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
      let listenerValue: any = comEl.getValue(value)

      if(typeof listenerValue !== 'function') {
        throw new Error(`Invalid event listener for ${name} event, "${value}" was not a function`)
      }
      
      // Add event listener
      node[`on${event}`] = (e) => listenerValue.bind(comEl.context)(e)
    }
    else {
      return
    }

    // Remove
    node.removeAttribute(name)
  }
}