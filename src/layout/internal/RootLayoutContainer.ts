import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer} from '../interfaces';

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
    this.node.appendChild(child.node);
    return super.push(child);
  }

  remove(child: ILayoutContainer) {
    child.node.remove();
    return super.remove(child);
  }
}
