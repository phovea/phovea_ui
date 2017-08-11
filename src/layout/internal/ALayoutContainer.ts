import {EventHandler} from 'phovea_core/src/event';
import {ILayoutDump, LayoutContainerEvents} from '../interfaces';
import {dragAble, uniqueId} from 'phovea_core/src';
import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer} from '../';

export interface ILayoutContainerOption {
  name: string;
  readonly fixed: boolean;
}

export abstract class ALayoutContainer<T extends ILayoutContainerOption> extends EventHandler {
  static readonly MIME_TYPE = 'text/x-phovea-layout-container';

  parent: AParentLayoutContainer<any> | null = null;

  protected readonly options: T;
  readonly header: HTMLElement;

  readonly id = uniqueId(ALayoutContainer.MIME_TYPE);

  constructor(document: Document, options: Partial<T>) {
    super();
    console.assert(document != null);
    this.options = Object.assign(this.defaultOptions(), options);
    this.header = document.createElement('header');
    this.header.innerHTML = `
        <button type="button" class="close${this.options.fixed ? ' hidden' : ''}" aria-label="Close"><span aria-hidden="true">×</span></button>
        <span>${this.name}</span>`;

    //remove
    this.header.firstElementChild.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.destroy();
    });

    //drag
    if (!this.options.fixed) {
      dragAble(this.header, () => {
        return {
          effectAllowed: 'move',
          data: {
            'text/plain': this.name,
            [ALayoutContainer.MIME_TYPE]: String(this.id)
          }
        };
      }, true);
    }
  }

  get parents() {
    const r: AParentLayoutContainer<any>[] = [];
    let p = this.parent;
    while (p !== null) {
      r.push(p);
      p = p.parent;
    }
    return r;
  }

  get hideAbleHeader() {
    return false;
  }

  protected defaultOptions(): T {
    return <any>{
      name: 'View',
      fixed: false,
      hideAbleHeader: false
    };
  }

  destroy() {
    this.fire(LayoutContainerEvents.EVENT_DESTROYED, this);
  }

  get name() {
    return this.options.name;
  }

  set name(name: string) {
    if (this.options.name === name) {
      return;
    }
    this.fire(LayoutContainerEvents.EVENT_NAME_CHANGED, this.options.name, this.options.name = name);
    this.updateName(name);
  }

  protected updateName(name: string) {
    this.header.children[1].textContent = name;
  }

  persist(): ILayoutDump {
    return {
      type: '',
      name: this.name,
      fixed: this.options.fixed
    };
  }

  static restoreOptions(dump: ILayoutDump): Partial<ILayoutContainerOption> {
    return {
      name: dump.name,
      fixed: dump.fixed
    };
  }

  find(id: number|((container: ILayoutContainer)=>boolean)) {
    return (typeof id === 'number' && this.id === id) || (typeof id === 'function' && id(<any>this)) ? this : null;
  }
}

export default ALayoutContainer;
