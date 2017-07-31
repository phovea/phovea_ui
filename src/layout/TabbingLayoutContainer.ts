import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer, ISize} from './interfaces';


export default class TabbingLayoutContainer extends AParentLayoutContainer {
  readonly minChildCount = 0;
  private _active: ILayoutContainer | null = null;

  constructor(document: Document, ...children: ILayoutContainer[]) {
    super(document);
    this.node.dataset.layout = 'tabbing';
    children.forEach((d) => this.push(d));
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
    if (this.active === null) {
      this.active = child;
    }
    child.visible = child === this.active;
    return r;
  }

  remove(child: ILayoutContainer) {
    if (this.active === child) {
      const index = this._children.indexOf(child);
      this.active = this.length === 1 ? null : (index === 0 ? this._children[1] : this._children[index - 1]);
    }
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
      oldActive.visible = false;
    }
    if (newActive) {
      newActive.visible = true;
    }
  }

  protected visibilityChanged(visible: boolean): void {
    if (this.active) {
      this.active.visible = visible;
    }
  }
}
