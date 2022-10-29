# BubbleJS
Simple frontend framework using WebComponents.

# Features
- Components
- Refs 
- Props
- Events
- Directives
- Conditions
- Loops (In development)

## Components
Components are classes that represents WebComponents. To define your component use a `Component` decorator with tag name of component as argument:

```ts
import { ComponentBase, Component, html } from 'bubble-js'

@Component('my-component')
class MyComponent extends ComponentBase {
  // Template for rendering
  template() {
    return html`
      <span>Hello world!</span>
    `
  }
  
  // Style of component
  styles() {
    return `
      :host { /* ... */ }
      span { color: red; }
    `
  }

  // Lifecycle hooks
  onBeforeMount() {
    console.log('Before mounted')
  }
  onMount() {
    console.log('Mounted')
  }
  onAdopt() {
    console.log('Adopted')
  }
  onDestroy() {
    console.log('Destroyed')
  }
}
```
```html
<my-component></my-component>
```

When you define a component class, you should define a `template()` method, that returns HTML template that will be rendered.
The `styles()` method is optional and used to define CSS of your component.

## Refs
Refs are simply reactive data variables, that can be used inside component. To define a ref use a `Ref` decorator:

```ts
import { ComponentBase, Component, Ref, html } from 'bubble-js'

@Component('my-component')
class MyComponent extends ComponentBase {
  @Ref
  public count: number = 0

  template() {
    return html`
      <span>
        Count is ${ this.count }
      </span>
    `
  }

  onMount() {
    setInterval(() => {
      this.count++
    }, 100)
  }
}
```
```html
<my-component></my-component>
```

Refs can be accessed via `this` context inside `template`, lifecycle hooks, event listeners, methods.

## Props
Props allows to define acceptable properties of your component. To define a component prop use a `Prop` decorator:

```ts
import { ComponentBase, Component, Prop, html } from 'bubble-js'

@Component('my-component')
class MyComponent extends ComponentBase {
  @Prop()
  public text: string = ''

  template() {
    return html`
      <span>${ this.text }</span>
    `
  }
}
```
```html
<my-component text="Hello world"></my-component>
```

**Notice**: you can pass arrays/objects/functions as prop value also, but only inside another component template.

Props can be accessed via `this` context inside `template`, lifecycle hooks, event listeners, methods.

## Events
-

## Directives
-

## Conditions (Elements)
-

## Conditions (Attributes)
-

## Loops
Development in progress.
