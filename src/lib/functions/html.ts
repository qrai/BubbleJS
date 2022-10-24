import HtmlTemplate from "../types/HtmlTemplate"

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
        let key: string = `${valueName}_${i}`
        template.values[key] = childTemplate.values[valueName]
      }
      return childTemplate.raw
    })
    
    return raws.join('')
  }
  // Array | Object | Function
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
  let result: HtmlTemplate = {
    _last: 0,
    values: {},
    // Raw HTML
    raw: ''
  }
  strings.forEach((string: string, i: number) => {
    result.raw += string + (serializeData(keys[i], result) || '')
  })
  return result
}