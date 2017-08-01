import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer} from '../interfaces';
import TabbingLayoutContainer from './TabbingLayoutContainer';
import {ILayoutContainerOption} from './ALayoutContainer';

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
