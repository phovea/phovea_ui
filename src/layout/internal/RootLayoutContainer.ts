import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer, ILayoutDump} from '../interfaces';
import TabbingLayoutContainer from './TabbingLayoutContainer';
import {ALayoutContainer, ILayoutContainerOption} from './ALayoutContainer';

export default class RootLayoutContainer extends AParentLayoutContainer<ILayoutContainerOption> {
  readonly minChildCount = 0;

  constructor(document: Document) {
    super(document, {
      name: '',
      closeAble: false
    });
    this.node.dataset.layout = 'root';
  }

  setRoot(root: ILayoutContainer) {
    this.push(root);
  }

  getRoot(root: ILayoutContainer) {
    return this._children[0];
  }

  get minSize() {
    return this._children[0].minSize;
  }

  push(child: ILayoutContainer) {
    const r = super.push(child);
    if (child instanceof TabbingLayoutContainer) {
      //need the header
      this.node.appendChild(child.header);
    }
    this.node.appendChild(child.node);
    return r;
  }

  remove(child: ILayoutContainer) {
    child.header.remove();
    child.node.remove();
    return super.remove(child);
  }

  persist() {
    return Object.assign(super.persist(), {
      type: 'root'
    });
  }

  static restore(dump: ILayoutDump, restore: (dump: ILayoutDump)=>ILayoutContainer, doc: Document) {
    const r = new RootLayoutContainer(doc);
    if (dump.children && dump.children.length > 0) {
      r.setRoot(restore(dump.children[0]));
      dump.children.slice(1).forEach((d) => r.push(restore(d)));
    }
    return r;
  }
}
