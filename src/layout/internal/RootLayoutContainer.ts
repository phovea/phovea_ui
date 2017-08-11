import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer, ILayoutDump, IRootLayoutContainer} from '../interfaces';
import TabbingLayoutContainer from './TabbingLayoutContainer';
import {ILayoutContainerOption} from './ALayoutContainer';
import {IDropArea} from './interfaces';
import {IBuildAbleOrViewLike} from '../builder';

export default class RootLayoutContainer extends AParentLayoutContainer<ILayoutContainerOption> implements IRootLayoutContainer {
  readonly minChildCount = 0;
  readonly type = 'root';

  constructor(document: Document, public readonly build: (layout: IBuildAbleOrViewLike)=> ILayoutContainer) {
    super(document, {
      name: '',
      fixed: true
    });
    this.node.dataset.layout = 'root';
  }

  set root(root: ILayoutContainer) {
    if (this._children.length > 0) {
      this.replace(this.root, root);
    } else {
      this.push(root);
    }
  }

  get root() {
    return this._children[0];
  }

  get minSize() {
    return this._children[0].minSize;
  }

  protected addedChild(child: ILayoutContainer, index: number) {
    super.addedChild(child, index);
    if (child instanceof TabbingLayoutContainer) {
      //need the header
      this.node.appendChild(child.header);
    }
    this.node.appendChild(child.node);
  }

  place(child: ILayoutContainer, reference: ILayoutContainer, area: IDropArea) {
    return this.push(child);
  }

  protected takeDownChild(child: ILayoutContainer) {
    if (child instanceof TabbingLayoutContainer) {
      this.node.removeChild(child.header);
    }
    this.node.removeChild(child.node);
    super.takeDownChild(child);
  }

  persist() {
    return Object.assign(super.persist(), {
      type: 'root'
    });
  }

  static restore(dump: ILayoutDump, restore: (dump: ILayoutDump) => ILayoutContainer, doc: Document, build: (root: RootLayoutContainer, layout: IBuildAbleOrViewLike)=> ILayoutContainer) {
    const r = new RootLayoutContainer(doc, (layout) => build(r, layout));
    if (dump.children && dump.children.length > 0) {
      r.root = restore(dump.children[0]);
      dump.children.slice(1).forEach((d) => r.push(restore(d)));
    }
    return r;
  }
}
