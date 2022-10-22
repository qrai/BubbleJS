import Registry from './Registry'

import createComponentClass from '../functions/createComponentClass'

export default abstract class Component {
  constructor() {
    // Define style
    Registry.defineStyle(
      this.name,
      this.style?.() ?? ''
    )
    
    // Define element in registry
    Registry.defineComponent(
      // Component name
      this.name,
      // Component class
      createComponentClass(this)
    )
  }

  public static define(classDefinition)  {
    new classDefinition()
  }

  // Name of the component (camel-case)
  abstract get name(): string
  
  // Template of the component
  abstract template: { (): string }
  // Style of the component
  abstract style?: { (): string }
  
  // Hooks
  abstract onCreate?: { (): void }
  abstract onMount?: { (): void }
  abstract onDestroy?: { (): void }
  abstract onAdopt?: { (): void }
}