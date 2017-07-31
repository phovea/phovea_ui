import {AParentLayoutContainer} from './AParentLayoutContainer';
import {EOrientation, ILayoutContainer, ISize} from './interfaces';

export default class LineUpLayoutContainer extends AParentLayoutContainer {
  readonly minChildCount = 0;

  constructor(document: Document, name: string, private readonly orientation: EOrientation, ...children: ILayoutContainer[]) {
    super(document, name);
    console.assert(orientation != null);

    this.node.dataset.layout = 'lineup';
    this.node.dataset.orientation = orientation === EOrientation.HORIZONTAL ? 'h' : 'v';
    children.forEach((d) => this.push(d));
  }

  get minSize() {
    console.assert(this.length > 1);
    switch (this.orientation) {
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
   this.node.appendChild(wrap(child));
    return super.push(child);
  }

  remove(child: ILayoutContainer) {
    child.node.parentElement.remove();
    return super.remove(child);
  }

  protected updateChildName(child: ILayoutContainer, name: string) {
    //update header
    child.node.parentElement.firstElementChild.textContent = name;
  }
}

function wrap(child: ILayoutContainer) {
  const s = child.node.ownerDocument.createElement('section');
  s.innerHTML = `<header>${child.name}</header><main></main>`;
  s.lastElementChild.appendChild(child.node);
  return s;
}
