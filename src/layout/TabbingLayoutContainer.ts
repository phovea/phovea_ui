import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer, ISize} from './interfaces';


export default class TabbingLayoutContainer extends AParentLayoutContainer {
  readonly minChildCount = 0;
  private _active: ILayoutContainer | null = null;

  constructor(document: Document, name: string, ...children: ILayoutContainer[]) {
    super(document, name);
    this.node.dataset.layout = 'tabbing';
    this.node.innerHTML = `<header></header><main></main>`;
    children.forEach((d) => this.push(d));
  }

  private get header() {
    return <HTMLElement>this.node.firstElementChild;
  }

  private get main() {
    return <HTMLElement>this.node.lastElementChild;
  }

  get active() {
    return this._active;
  }

  set active(child: ILayoutContainer) {
    console.assert(this._children.indexOf(child) >= 0);
    if (this._active === child) {
      return;
    }
    this.activeChanged(this._active, this._active = child);
  }

  push(child: ILayoutContainer) {
    const r = super.push(child);
    child.visible = child === this.active;
    this.header.insertAdjacentHTML('beforeend', `<section>${child.name}</section>`);
    this.header.lastElementChild.addEventListener('click', () => {
      this.active = child;
    });
    this.main.appendChild(child.node);

    if (this.active === null) {
      this.active = child;
    }
    return r;
  }

  remove(child: ILayoutContainer) {
    const index = this._children.indexOf(child);
    if (this.active === child) {
      this.active = this.length === 1 ? null : (index === 0 ? this._children[1] : this._children[index - 1]!);
    }
    this.header.children[index]!.remove();
    child.node.remove();
    return super.remove(child);
  }

  get minSize() {
    //max
    return <ISize>this._children.reduce((a, c) => {
      const cmin = c.minSize;
      return [Math.max(a[0], cmin[0]), Math.max(a[1], cmin[1])];
    }, [0, 0]);
  }

  private activeChanged(oldActive: ILayoutContainer | null, newActive: ILayoutContainer | null) {
    if (oldActive) {
      const index = this._children.indexOf(oldActive);
      this.header.children[index]!.classList.remove('active');
      oldActive.node.classList.remove('active');
      oldActive.visible = false;
    }
    if (newActive) {
      const index = this._children.indexOf(newActive);
      this.header.children[index]!.classList.add('active');
      newActive.node.classList.add('active');
      newActive.visible = this.visible;
    }
  }

  protected visibilityChanged(visible: boolean): void {
    if (this.active) {
      this.active.visible = visible;
    }
  }
}
