import ComponentBase from './core/ComponentBase'

import Registry from './core/Registry'

// Decorators
import Component from './decorators/Component.dec'
import View from './decorators/View.dec'
import Prop from './decorators/Prop.dec'
import Ref from './decorators/Ref.dec'
import Element from './decorators/Element.dec'
import WatchRef from './decorators/WatchRef.dec'
import MapRef from './decorators/MapRef.dec'
import CachedRef from './decorators/CachedRef.dec'

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
  Element,
  WatchRef,
  MapRef,
  CachedRef,

  Registry,

  html
}