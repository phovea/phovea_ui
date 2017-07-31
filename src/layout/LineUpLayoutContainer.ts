import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer, ISize} from './interfaces';
import {ESplitOrientation} from './SplitLayoutContainer';

class ALineUpLayoutContainer extends AParentLayoutContainer {
  readonly minChildCount = 0;

  constructor(document: Document, private readonly orientation: ESplitOrientation, ...children: ILayoutContainer[]) {
    super(document);
    console.assert(orientation != null);

    this.node.dataset.layout = 'lineup';
    this.node.dataset.orientation = orientation === ESplitOrientation.HORIZONTAL ? 'h' : 'v';
    children.forEach((d) => this.push(d));
  }

  get minSize() {
    console.assert(this.length > 1);
    switch (this.orientation) {
      case ESplitOrientation.HORIZONTAL:
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [a[0] + cmin[0], Math.max(a[1], cmin[1])];
        }, [0, 0]);
      case ESplitOrientation.VERTICAL: {
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [Math.max(a[0], cmin[0]), a[1] + cmin[1]];
        }, [0, 0]);
      }
    }
  }
}

export class HorizontalLineUpContainer extends ALineUpLayoutContainer {

  constructor(document: Document, ...children: ILayoutContainer[]) {
    super(document, ESplitOrientation.HORIZONTAL, ...children);
  }
}

export class VerticalLineUpContainer extends ALineUpLayoutContainer {

  constructor(document: Document, ...children: ILayoutContainer[]) {
    super(document, ESplitOrientation.VERTICAL, ...children);
  }
}
