import { ComponentBase, Component, Ref, Prop, Event, html } from './lib/bubble'

@Component('todo-list-item')
class TodoListItem extends ComponentBase {
  @Prop()
  public text: string = '';

  template() {
    return html`
      <div @click="${this.onClick}" class="list__item">
        <p class="list__item_text">
          ${this.text}
        </p>
      </div>
    `;
  }

  onClick(e: Event) {
    e.preventDefault()

    // Emit remove of item
    this.emit('remove')
  }

  styles() {
    return /*css*/`
      :host {
        --font: Manrope, sans-serif;
      }

      .list__item {
        width: 100%;

        padding: 10px 16px;
        margin-bottom: 8px;

        border: 2px solid #d8dadd;
        border-radius: 8px;

        font-family: var(--font);
      }

      .list__item_text {
        margin: 0;
      }
    `;
  }
}

@Component('todo-list')
class TodoList extends ComponentBase {
  @Ref
  public currentItem: string = '';

  @Ref
  public items: string[] = [];

  template() {
    return html`
      <div class="list">
        ${this.items.map((item) => html`
          <todo-list-item
            text="${item}"
            @remove="${this.removeItem(item)}"
          ></todo-list-item>
        `)}
      </div>

      <div class="list__input-group">
        <input
          @input="${this.enterItem}"
          type="text"
          placeholder="Enter text"
          class="list__input"
        >

        <button
          @click="${this.addItem}"
          class="list__input-button"
        >
          Add
        </button>
      </div>
    `;
  }

  removeItem(val: string) {
    return () => {
      this.items = this.items.filter(currVal => currVal !== val)
    }
  }

  addItem(e: Event) {
    e.preventDefault();

    // Add item
    this.items = [
      ...this.items,
      this.currentItem
    ];

    // Reset input
    this.currentItem = '';
  }

  enterItem(e: any) {
    e.preventDefault();
    
    this.currentItem = e.target.value;
  }

  styles() {
    return /*css*/`
      :host {
        --font: Manrope, sans-serif;

        display: flex;
        flex-direction: column;

        width: 100%;
        max-width: 360px;

        margin: auto;
      }

      .list {
        width: 100%;

        display: flex;
        flex-direction: column;
      }

      .list__input-group {
        width: 100%;

        margin-top: 8px;

        display: flex;
      }
      .list__input-button {
        margin-left: 8px;

        padding: 12px 20px;

        background: #4938ff;
        color: white;

        border: none;
        border-radius: 8px;
        outline: none;

        cursor: pointer;

        font-family: var(--font);
        font-size: 16px;

        transition: 0.3s ease-in-out;
      }
      .list__input-button:hover {
        background: #6456fb;
      }
      .list__input {
        width: 100%;

        padding: 8px 12px;

        border: none;
        border-radius: 8px;
        outline: none;

        background: #e5e8ee;

        font-family: var(--font);
        font-size: 16px;

        appearance: none;
      }
    `;
  }
}