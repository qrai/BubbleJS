import { ComponentBase, Component, Ref, html, Registry } from '../index';

@Component('bubble-router')
export class BubbleRouter extends ComponentBase {
  template() {
    const view = Registry.getView(this.getRoute())

    return view
      ? html`
        <${view.name} data-view=""></${view.name}>
      `
      : html`
        <p>404 | Not found</p>
      `
  }

  onMount(): void {
    Registry.addEventListener('viewadded', (route) => {
      // Check if new route is matches
      if(Registry.compareMatch(route, this.getRoute())) {
        this.render()
      }
    })
  }

  private getRoute(): string {
    return window.location.hash
      ? window.location.hash.substring(1) || '/'
      : '/'
  }

  styles() {
    return /*css*/ `
      :host, :host > [data-view] {
        display: block;
        width: 100%;
        height: 100%;
      }
    `
  }
}