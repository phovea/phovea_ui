import {ILayoutContainer, ILayoutParentContainer, ISize} from './interfaces';
import {EventHandler, IEvent} from 'phovea_core/src/event';

export abstract class AParentLayoutContainer extends EventHandler implements ILayoutParentContainer {
  private _parent: ILayoutParentContainer | null;
  readonly node: HTMLElement;
  abstract readonly minChildCount: number;
  protected readonly _children: ILayoutContainer[] = [];
  private _visible: boolean;
  private _name: string = 'Container';

  readonly header: HTMLElement;

  constructor(document: Document, name: string) {
    super();
    console.assert(document != null);
    this._name = name;
    this.node = document.createElement('main');
    this.node.classList.add('phovea-layout', 'phovea-layout-root');

    this.header = document.createElement('header');
    this.header.innerText = name;
  }

  forEach(callback: (child: ILayoutContainer, index: number) => void) {
    this._children.forEach(callback);
  }

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
    this.header.innerText = name;
  }

  get children() {
    return this._children.slice();
  }

  [Symbol.iterator]() {
    return this._children[Symbol.iterator]();
  }

  get length() {
    return this._children.length;
  }

  get visible() {
    return this._visible;
  }

  set visible(visible: boolean) {
    if (this._visible === visible) {
      return;
    }
    this._visible = visible;
    this.visibilityChanged(visible);
  }

  protected visibilityChanged(visible: boolean): void {
    this.forEach((c) => c.visible = visible);
  }

  abstract get minSize(): ISize;

  get parent() {
    return this._parent;
  }

  set parent(parent: ILayoutParentContainer|null) {
    this._parent = parent;
    if (!parent) {
      this.node.classList.add('phovea-layout-root');
    } else {
      this.node.classList.remove('phovea-layout-root');
    }
  }

  push(child: ILayoutContainer) {
    if (child.parent) {
      child.parent.remove(child);
    }
    child.parent = this;
    this._children.push(child);
    return true;
  }

  remove(child: ILayoutContainer) {
    child.parent = null;
    this._children.splice(this._children.indexOf(child), 1);
    return true;
  }

  resized() {
    this.forEach((d) => d.resized());
  }

  destroy() {
    this.forEach((d) => d.destroy());
  }
}

export default AParentLayoutContainer;
