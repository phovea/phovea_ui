import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer, ILayoutDump, ISize} from '../interfaces';
import {ALayoutContainer, ILayoutContainerOption} from './ALayoutContainer';
import {dropAble} from 'phovea_core/src';


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

    dropAble(this.header, [ALayoutContainer.MIME_TYPE], (result) => {
      const id = parseInt(result.data[ALayoutContainer.MIME_TYPE], 10);
      console.assert(id >= 0);
      //find id and move it here
      const root = this.root;
      const toMove = root.find(id);
      if (toMove === null || this._children.indexOf(toMove) >= 0) {
        return false;
      }
      //not a child already
      this.push(toMove);
      return true;
    }, true);
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

  protected addedChild(child: ILayoutContainer, index: number) {
    super.addedChild(child, index);
    child.visible = child === this.active;

    child.header.onclick = () => {
      this.active = child;
    };
    if (index < 0 || index >= this.length - 1) {
      this.header.appendChild(child.header);
      this.node.appendChild(child.node);
    } else {
      this.header.insertBefore(child.header, this._children[index + 1].header);
      this.node.insertBefore(child.node, this._children[index + 1].node);
    }

    if (this.active === null) {
      this.active = child;
    }
  }

  replace(child: ILayoutContainer, replacement: ILayoutContainer) {
    const wasActive = child === this.active;
    super.replace(child, replacement);
    if (wasActive) {
      this.active = replacement;
    }
    return true;
  }

  protected takeDownChild(child: ILayoutContainer) {
    if (this.active === child) {
      const index = this._children.indexOf(child);
      this.active = this.length === 1 ? null : (index === 0 ? this._children[1] : this._children[index - 1]!);
    }
    child.header.onclick = null;
    this.header.removeChild(child.header);
    this.node.removeChild(child.node);
    super.takeDownChild(child);
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
