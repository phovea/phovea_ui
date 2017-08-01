import {AParentLayoutContainer} from './AParentLayoutContainer';
import {EOrientation, ILayoutContainer, ILayoutDump, ISize} from '../interfaces';
import {ALayoutContainer, ILayoutContainerOption} from 'phovea_ui/src/layout/internal/ALayoutContainer';

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

  push(child: ILayoutContainer) {
    const r = super.push(child);
    this.node.appendChild(wrap(child));
    return r;
  }

  remove(child: ILayoutContainer) {
    child.node.parentElement.remove();
    return super.remove(child);
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
