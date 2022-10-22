type PropMetadata = {
  origin: 'attr' | 'prop'
  value: any,
  required: boolean,
  validator?: (val: any) => boolean
}
export default function createProps(el: HTMLElement, onChanged: Function): object {
  // Copy attributes and add them to props
  const props: { [key: string]: PropMetadata } = {}
  for(let attr of el.attributes) {
    props[attr.name] = {
      origin: 'attr',
      value: attr.value,
      required: false
    }
  }

  // Copy props
  for(let propName in el.metadata.props) {
    let propOptions = el.metadata.props[propName]
    props[propName] = {
      origin: 'prop',
      value: el.getAttribute(propName) ?? undefined,
      required: propOptions.required ?? true,
      validator: propOptions.validator ?? undefined
    }
  }

  // Return proxified props
  const proxy = new Proxy(props, {
    get(target, key) {
      return target[key]?.value
    },
    set (target, key, value) {
      // Property exists
      if(target[key]) {
        let meta: PropMetadata = target[key]

        // Required 
        if(meta.required && value === undefined) {
          throw new Error(`Component <${el.tagName}> is missing property "${key}"`)
        }
        //TODO: Validator
        
        // Change value
        target[key].value = value
        
        // Change attribute
        if(el.hasAttribute(key)) {
          el.setAttribute(key, value)
        }

        // Call hook
        onChanged(value)

        return true
      }
      
      return false
    }
  })

  return proxy
}