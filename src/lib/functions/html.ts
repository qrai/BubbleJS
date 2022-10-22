type PossibleHtmlValue = string | number | boolean | Function

// Transform HTML with pasted JS to HTML with serialized data
export default function html(strings: TemplateStringsArray, ...keys: PossibleHtmlValue[]): string {
  let result: string = ''
  strings.forEach((string, i) => {
    result += string + (keys[i] || '')
  })
  return result
}