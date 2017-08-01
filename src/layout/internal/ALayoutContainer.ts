import {EventHandler} from 'phovea_core/src/event';

export interface ILayoutContainerOption {
  name: string;
  readonly closeAble: boolean;
}

export abstract class ALayoutContainer<T extends ILayoutContainerOption> extends EventHandler {
  protected readonly options: T;
  readonly header: HTMLElement;

  constructor(document: Document, options: Partial<T>) {
    super();
    console.assert(document != null);
    this.options = Object.assign(this.defaultOptions(), options);
    this.header = document.createElement('header');
    this.header.innerHTML = `
        <button type="button" class="close${!this.options.closeAble ? ' hidden' : ''}" aria-label="Close"><span aria-hidden="true">×</span></button>
        <span>${this.name}</span>`;
    this.header.firstElementChild.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.destroy();
    });
  }

  protected defaultOptions(): T {
    return <any>{
      name: 'View',
      closeAble: true
    };
  }

  abstract destroy(): void;

  get name() {
    return this.options.name;
  }

  set name(name: string) {
    if (this.options.name === name) {
      return;
    }
    this.options.name = name;
    this.updateName(name);
  }

  protected updateName(name: string) {
    this.header.children[1].textContent = name;
  }
}

export default ALayoutContainer;
