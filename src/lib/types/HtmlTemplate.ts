export default interface HtmlTemplate {
    values: { [key: string]: any },
    _last: number,
    raw: string
}