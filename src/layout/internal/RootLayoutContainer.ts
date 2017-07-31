import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer} from '../interfaces';
import TabbingLayoutContainer from './TabbingLayoutContainer';

export default class RootLayoutContainer extends AParentLayoutContainer {
  readonly minChildCount = 0;

  constructor(document: Document) {
    super(document, '');
    this.node.dataset.layout = 'root';
  }

  setRoot(root: ILayoutContainer) {
    this.push(root);
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
}
