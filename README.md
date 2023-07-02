# BubbleJS
Frontend framework based on WebComponents with full support of TypeScript.

# Features
- Components
  - Refs 
  - Props
  - Events
  - Conditions
  - Loops
- Directives
- Routing & Views
- Caching

## Components
Components are classes that represents WebComponents. To define your component use a `Component` decorator with tag name of component as argument:

```ts
import { ComponentBase, Component, Ref, html } from 'bubblejs-core';

@Component('my-component')
class MyComponent extends ComponentBase {
  @Ref
  public count: number = 0;

  template() {
    return html`
      <button @click="${this.onClick}">
        Clicked ${this.count} times
      </button>
    `;
  }

  onClick() {
    this.count++;
  }

  // Lifecycle hooks
  onBeforeMount() {
    console.log('Before mounted');
  }
  onMount() {
    console.log('Mounted');
  }
  onAdopt() {
    console.log('Adopted');
  }
  onDestroy() {
    console.log('Destroyed');
  }

  styles() {
    return /*css*/`
      button {
        padding: 12px 20px;

        background: #4938ff;
        color: white;

        border: none;
        border-radius: 8px;
        outline: none;

        cursor: pointer;

        font-size: 16px;

        transition: 0.3s ease-in-out;
      }
      button:hover {
        background: #6456fb;
      }
    `;
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
import { ComponentBase, Component, Ref, html } from 'bubblejs-core';

@Component('my-component')
class MyComponent extends ComponentBase {
  @Ref
  public count: number = 0;

  template() {
    return html`
      <span>
        Count is ${ this.count }
      </span>
    `;
  }

  onMount() {
    setInterval(() => {
      this.count++
    }, 100);
  }
}
```
```html
<my-component></my-component>
```

Refs can be accessed via `this` context inside `template`, lifecycle hooks, event listeners, methods.

## WatchRefs
...

## Props
Props allows to define acceptable properties of your component. To define a component prop use a `Prop` decorator:

```ts
import { ComponentBase, Component, Prop, html } from 'bubblejs-core';

@Component('my-component')
class MyComponent extends ComponentBase {
  @Prop()
  public text: string = '';

  template() {
    return html`
      <span>${ this.text }</span>
    `;
  }
}
```
```html
<my-component text="Hello world"></my-component>
```

**Notice**: you can pass arrays/objects/functions as prop value also, but only inside another component template.

Props can be accessed via `this` context inside `template`, lifecycle hooks, event listeners, methods.

## Events
Events allows you to emit custom events up to parent component.
You just have to call `this.emit(eventName, ...args)` method to emit your event.
```ts
import { ComponentBase, Component, html } from 'bubblejs-core';

@Component('my-child')
class MyChild extends ComponentBase {
  template() {
    return html`
      <button @click="${this.onClick}">
        Button!
      </button>
    `;
  }

  onClick(e: Event) {
    e.preventDefault();

    // Emit custom event
    this.emit('some-event');
  }
}

@Component('my-parent')
class MyParent extends ComponentBase {
  template() {
    return html`
      <mychild @some-event="${() => console.log('fired!')}"></mychild>
    `;
  }
}
```

**Notice**: `emit` method is calls native `dispatchEvent`, that means you can also
use native `addEventListener` to catch your component's custom event.

## Directives
-

## Conditions (Elements)
For conditional rendering framework is provides special reserved directives `--if` and `--else`. You should pass boolean value, if value will be `true`, the element will be rendered, otherwise it will render the `--else` element.
```ts
import { ComponentBase, Component, Ref, html } from './lib/index';

@Component('my-component')
class MyComponent extends ComponentBase {
  @Ref
  public doRender: boolean = false;

  template() {
    return html`
      <p --if="${this.doRender}">
        Hello world!
      </p>
      <p --else>
        Bye world!
      </p>
    `;
  }
}
```
After render:
```html
<my-component>
  <p>Bye world!</p>
</my-component>
```

## Conditions (Attributes)
As you apply conditions to render or not elements, you can apply conditions to set attribute or not. Framework provides special syntax for conditional attributes: `attrName:if="${true | false}"`. If value will be true, the element will have `attrName=""` attribute, otherwise attribute will be not added.

```ts
import { ComponentBase, Component, Ref, html } from './lib/index';

@Component('my-component')
class MyComponent extends ComponentBase {
  @Ref
  public isRequired: boolean = false;

  @Ref
  public isDisabled: boolean = true;

  template() {
    return html`
      <input required:if="${this.isRequired}" disabled:if="${this.isDisabled}">
    `;
  }
}
```
After render:
```html
<my-component>
  <input disabled="">
</my-component>
```

## Loops
Loops can be helpful when you need to render a list of something. To create a loop you can use a native array `.map` method.
```ts

import { ComponentBase, Component, Ref, html } from 'bubblejs-core';

@Component('some-list')
class SomeList extends ComponentBase {
  @Ref
  public items: string[] = [
    'hello',
    'world',
    'guys'
  ];

  template() {
    return html`
      <div class="list">
        ${this.items.map((item) => html`
          <div class="list__item">
            <p>${item}</p>
          </div>
        `)}
      </div>
    `;
  }
}
```

**Notice**: you can use alternative ways to do a loops, but in any way the returned value should be of type `HtmlTemplate[]`.

## Routing
Framework also provides a built-in lightweight routing system.
Firstly you have to use `bubble-router` component which is renders
current view inside:
```html
<bubble-router></bubble-router>
```

After that you can define views in your code using `View` decorator:
```ts
import { ComponentBase, View, Ref, html } from 'bubblejs-core';

@View('/')
class IndexView extends ComponentBase {
  @Ref
  public subject = 'world';

  template() {
    return html`
      <p>Hello ${subject}!</p>
    `;
  }
}
```
As you see, views are basically components but defined in different way.
