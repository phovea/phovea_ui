import {AParentLayoutContainer} from './AParentLayoutContainer';
import {EOrientation, ILayoutContainer, ISize} from './interfaces';



export default class SplitLayoutContainer extends AParentLayoutContainer {
  private static readonly SEPARATOR = `<div data-layout="separator"/>`;
  private static readonly SEPARATOR_WIDTH = 5;

  readonly minChildCount = 2;

  private readonly _ratios: number[] = [];

  constructor(document: Document, private readonly orientation: EOrientation, ratio: number, child1: ILayoutContainer, child2: ILayoutContainer) {
    super(document);
    console.assert(orientation != null);
    this.node.dataset.layout = 'split';
    this.node.dataset.orientation = orientation === EOrientation.HORIZONTAL ? 'h' : 'v';

    this.push(child1);
    this._ratios.push(ratio);
    this.push(child2);
  }

  get ratios() {
    return this._ratios.slice();
  }

  get minSize() {
    console.assert(this.length > 1);
    const padding = (this.length - 1) * SplitLayoutContainer.SEPARATOR_WIDTH;
    switch(this.orientation) {
      case EOrientation.HORIZONTAL:
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [a[0] + cmin[0], Math.max(a[1], cmin[1])];
        }, [padding, 0]);
      case EOrientation.VERTICAL: {
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [Math.max(a[0], cmin[0]), a[1] + cmin[1]];
        }, [padding, 0]);
      }
    }
  }

  push(child: ILayoutContainer) {
    if (this.length > 0) {
      this.node.insertAdjacentHTML('beforeend', SplitLayoutContainer.SEPARATOR);
    }
    this.node.appendChild(child.node);
    return super.push(child);
  }

  remove(child: ILayoutContainer) {
    //in case of the first one use the next one since the next child is going to be the first one
    const separator = child.node.previousElementSibling || child.node.nextElementSibling;
    separator.remove();
    child.node.remove();
    return super.remove(child);
  }
}
