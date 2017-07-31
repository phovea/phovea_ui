import {EventHandler} from 'phovea_core/src/event';

export abstract class ALayoutContainer extends EventHandler {
  private _name: string;
  readonly header: HTMLElement;

  constructor(document: Document, name: string) {
    super();
    console.assert(document != null);
    console.assert(name != null);
    this._name = name;
    this.header = document.createElement('header');
    this.header.innerHTML = `
        <button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button>
        <span>${this.name}</span>`;
    this.header.firstElementChild.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.destroy();
    });
  }

  abstract destroy(): void;

  get name() {
    return this._name;
  }

  set name(name: string) {
    if (this._name === name) {
      return;
    }
    this._name = name;
    this.updateName(name);
  }

  protected updateName(name: string) {
    this.header.children[1].textContent = name;
  }
}

export default ALayoutContainer;
