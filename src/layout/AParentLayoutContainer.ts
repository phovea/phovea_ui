import {ILayoutContainer, ILayoutParentContainer, ISize} from './interfaces';
import {EventHandler} from 'phovea_core/src/event';

export abstract class AParentLayoutContainer extends EventHandler implements ILayoutParentContainer {
  parent: ILayoutParentContainer | null;
  readonly node: HTMLElement;
  abstract readonly minChildCount: number;
  protected readonly _children: ILayoutContainer[] = [];
  private _visible: boolean;

  constructor(document: Document) {
    super();
    console.assert(document != null);
    this.node = document.createElement('section');
    this.node.classList.add('phovea-layout');
  }

  forEach(callback: (child: ILayoutContainer, index: number) => void) {
    this._children.forEach(callback);
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
