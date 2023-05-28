import HtmlTemplate from "../types/HtmlTemplate.type"
import randomString from "./randomString"

type PossibleHtmlValue = string | number | boolean | any[] | object | Function | HtmlTemplate[]

function serializeData(data: any, template: HtmlTemplate): string {
  // Boolean | Number (Primitive)
  if(typeof data === 'boolean' || typeof data === 'number') {
    return data.toString()
  }
  // HtmlTemplate[]
  else if(Array.isArray(data) && data.every((el) => 'values' in el && '_last' in el)) {
    let raws: string[] = data.map((childTemplate: HtmlTemplate, i) => {
      for(let valueName in childTemplate.values) {
        const value = childTemplate.values[valueName]
        let key: string = ''
        if(typeof value === 'function' && value.name) {
          key = `$${value.name}`
        }
        else {
          key = `${valueName}_${i}`
        }

        template.values[key] = childTemplate.values[valueName]
        // this somehow not working
        template.raw = template.raw.replace(valueName, key)

        //TODO: need to fix a bug, where we change variable name in values but not changing in raw string
        console.log('UPDATE TEMPLATE', template)
      }
      return childTemplate.raw
    })
    
    return raws.join('')
  }
  // Function
  else if(typeof data === 'function' && data.name) {
    // Create key
    let key: string = `$${data.name}`
    // Store value
    template.values[key] = data
    return key
  }
  // Array | Object
  else if(Array.isArray(data) || typeof data === 'object' || typeof data === 'function') {
    // Create key
    let key: string = `$${template._last}`
    // Store value
    template.values[key] = data
    // Increase value, return key
    template._last++
    return key
  }
  // Other (as Primitive)
  else {
    return data?.toString() ?? ''
  }
}

// Transform HTML with pasted JS to HTML with serialized data
export default function html(strings: TemplateStringsArray, ...keys: PossibleHtmlValue[]): HtmlTemplate {
  const result: HtmlTemplate = {
    _last: 0,
    values: {},
    // Raw HTML
    raw: ''
  }

  strings.forEach((str: string, i: number) => {
    result.raw += str + (serializeData(keys[i], result) || '')
  })

  console.log(result)

  return result
}