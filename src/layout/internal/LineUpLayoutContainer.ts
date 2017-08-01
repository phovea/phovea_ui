import {AParentLayoutContainer} from './AParentLayoutContainer';
import {EOrientation, ILayoutContainer, ILayoutDump, ISize} from '../interfaces';
import {ALayoutContainer, ILayoutContainerOption} from './ALayoutContainer';

export interface ILineUpLayoutContainerOptions extends ILayoutContainerOption {
  readonly orientation: EOrientation;
}

export default class LineUpLayoutContainer extends AParentLayoutContainer<ILineUpLayoutContainerOptions> {
  readonly minChildCount = 0;

  constructor(document: Document, options: Partial<ILineUpLayoutContainerOptions>, ...children: ILayoutContainer[]) {
    super(document, options);

    this.node.dataset.layout = 'lineup';
    this.node.dataset.orientation = this.options.orientation === EOrientation.HORIZONTAL ? 'h' : 'v';
    children.forEach((d) => this.push(d));
  }

  defaultOptions() {
    return Object.assign(super.defaultOptions(), {
      orientation: EOrientation.HORIZONTAL
    });
  }

  get hideAbleHeader() {
    return this.options.fixed;
  }

  get minSize() {
    console.assert(this.length > 1);
    switch (this.options.orientation) {
      case EOrientation.HORIZONTAL:
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [a[0] + cmin[0], Math.max(a[1], cmin[1])];
        }, [0, 0]);
      case EOrientation.VERTICAL: {
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [Math.max(a[0], cmin[0]), a[1] + cmin[1]];
        }, [0, 0]);
      }
    }
  }

  protected addedChild(child: ILayoutContainer, index: number) {
    super.addedChild(child, index);
    if (index < 0 || index >= (this._children.length -1)) {
      //+1 since we already chanded the children
      this.node.appendChild(wrap(child));
    } else {
      this.node.insertBefore(wrap(child), this.node.children[index]);
    }
  }

  protected takeDownChild(child: ILayoutContainer) {
    this.node.removeChild(child.node.parentElement);
    super.takeDownChild(child);
  }

  persist() {
    return Object.assign(super.persist(), {
      type: 'lineup',
      orientation: EOrientation[this.options.orientation]
    });
  }

  static restore(dump: ILayoutDump, restore: (dump: ILayoutDump)=>ILayoutContainer, doc: Document) {
    const options = Object.assign(ALayoutContainer.restoreOptions(dump), {
      orientation: EOrientation[<string>dump.orientation]
    });
    const r = new LineUpLayoutContainer(doc, options);
    dump.children.forEach((d) => r.push(restore(d)));
    return r;
  }
}

function wrap(child: ILayoutContainer) {
  const s = child.node.ownerDocument.createElement('section');
  if (!child.hideAbleHeader) {
    s.appendChild(child.header);
  }
  s.appendChild(child.node);
  return s;
}
