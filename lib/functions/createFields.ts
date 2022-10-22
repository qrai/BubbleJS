type FieldMetadata = {
  is: 'attr' | 'prop' | 'ref'
  value: any,
  required?: boolean,
  validator?: (val: any) => boolean
}

export default function createFields(el: HTMLElement): object {
  // Copy attributes and add them to fields 
  const props: { [key: string]: FieldMetadata } = {}
  for(let attr of el.attributes) {
    props[attr.name] = {
      is: 'attr',
      value: attr.value,
      required: false
    }
  }

  // Copy props
  for(let propName in el.metadata.props) {
    let propOptions = el.metadata.props[propName]
    props[propName] = {
      is: 'prop',
      value: el.getAttribute(propName) ?? undefined,
      required: propOptions.required ?? true,
      validator: propOptions.validator ?? undefined
    }
  }

  // Copy refs
  for(let refName of el.metadata.refs) {
    props[refName] = {
      is: 'ref',
      value: el[refName]
    }
  }

  return props
}