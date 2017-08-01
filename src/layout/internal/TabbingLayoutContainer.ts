import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer, ILayoutDump, ISize} from '../interfaces';
import {ALayoutContainer, ILayoutContainerOption} from 'phovea_ui/src/layout/internal/ALayoutContainer';


export interface ITabbingLayoutContainerOptions extends ILayoutContainerOption {
  readonly active: number;
}

export default class TabbingLayoutContainer extends AParentLayoutContainer<ITabbingLayoutContainerOptions> {
  readonly minChildCount = 0;
  private _active: ILayoutContainer | null = null;

  constructor(document: Document, options: Partial<ITabbingLayoutContainerOptions>, ...children: ILayoutContainer[]) {
    super(document, options);
    this.node.dataset.layout = 'tabbing';
    this.header.dataset.layout = 'tabbing';
    children.forEach((d) => this.push(d));
    if (this.options.active != null && this.length >= this.options.active) {
      this.active = this._children[this.options.active];
    }
  }

  protected defaultOptions(): ITabbingLayoutContainerOptions {
    return Object.assign(super.defaultOptions(), {
      active: null
    });
  }

  get active() {
    return this._active;
  }

  set active(child: ILayoutContainer) {
    console.assert(!child || this._children.indexOf(child) >= 0);
    if (this._active === child) {
      return;
    }
    this.activeChanged(this._active, this._active = child);
  }

  push(child: ILayoutContainer) {
    const r = super.push(child);
    child.visible = child === this.active;
    this.header.appendChild(child.header);
    this.header.lastElementChild.addEventListener('click', () => {
      this.active = child;
    });
    this.node.appendChild(child.node);

    if (this.active === null) {
      this.active = child;
    }
    return r;
  }

  remove(child: ILayoutContainer) {
    if (this.active === child) {
      const index = this._children.indexOf(child);
      this.active = this.length === 1 ? null : (index === 0 ? this._children[1] : this._children[index - 1]!);
    }
    child.header.remove();
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
      oldActive.header.classList.remove('active');
      oldActive.node.classList.remove('active');
      oldActive.visible = false;
    }
    if (newActive) {
      newActive.header.classList.add('active');
      newActive.node.classList.add('active');
      newActive.visible = this.visible;
    }
  }

  protected visibilityChanged(visible: boolean): void {
    if (this.active) {
      this.active.visible = visible;
    }
  }

  persist() {
    return Object.assign(super.persist(), {
      type: 'tabbing',
      active: this._active ? this._children.indexOf(this._active) : null
    });
  }

  static restore(dump: ILayoutDump, restore: (dump: ILayoutDump)=>ILayoutContainer, doc: Document) {
    const r = new TabbingLayoutContainer(doc, ALayoutContainer.restoreOptions(dump));
    dump.children.forEach((d) => r.push(restore(d)));
    if (r.active != null) {
      r.active = r.children[<number>dump.active];
    }
    return r;
  }
}
