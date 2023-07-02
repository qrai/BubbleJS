import ComponentBase from './core/ComponentBase'

import Registry from './core/Registry'

// Decorators
import Component from './decorators/Component.dec'
import View from './decorators/View.dec'
import Prop from './decorators/Prop.dec'
import Ref from './decorators/Ref.dec'
import WatchRef from './decorators/WatchRef.dec'
import Event from './decorators/Event.dec'

// Components
import './router/BubbleRouter'

// Etc
import html from './functions/html'

export {
  ComponentBase,

  Component,
  View,
  Prop,
  Ref,
  WatchRef,
  Event,

  Registry,

  html
}