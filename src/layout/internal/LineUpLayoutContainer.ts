import {ILayoutContainer, ILayoutDump} from '../interfaces';
import {EOrientation, IDropArea} from './interfaces';
import {ALayoutContainer} from './ALayoutContainer';
import {ASequentialLayoutContainer, ISequentialLayoutContainerOptions, wrap} from './ASequentialLayoutContainer';

export interface ILineUpLayoutContainer extends ISequentialLayoutContainerOptions {
  stackLayout: boolean;
}

export default class LineUpLayoutContainer extends ASequentialLayoutContainer<ILineUpLayoutContainer> {
  readonly minChildCount = 1;
  readonly type = 'lineup';

  constructor(document: Document, options: Partial<ILineUpLayoutContainer>, ...children: ILayoutContainer[]) {
    super(document, options);
    this.node.dataset.layout = 'lineup';

    if(this.options.stackLayout) {
      this.node.dataset.mode ='stacked';
    }
    children.forEach((d) => this.push(d));
  }

  place(child: ILayoutContainer, reference: ILayoutContainer, area: IDropArea) {
    console.assert(area !== 'center');
    const index = this._children.indexOf(reference) + (area === 'right' || area === 'bottom' ? 1 : 0);
    return this.push(child, index);
  }

  protected addedChild(child: ILayoutContainer, index: number) {
    super.addedChild(child, index);
    const childNode = wrap(child);
    if(childNode) {
      if (index < 0 || index >= (this._children.length - 1)) {
        //+1 since we already chanded the children
        this.node.appendChild(childNode);
      } else {
        this.node.insertBefore(childNode, this.node.children[index]);
      }
    }

    if(this.options.stackLayout && child.node && child.node.parentElement) {
      if(this.options.orientation === EOrientation.HORIZONTAL) {
        child.node.parentElement.style.minWidth = child.minSize[0] > 0? `${child.minSize[0]}px` : null; // set minSize if available or delete CSS property
      } else {
        child.node.parentElement.style.minHeight = child.minSize[1] > 0? `${child.minSize[1]}px` : null;
      }
    }
    child.visible = this.visible;
  }

  protected takeDownChild(child: ILayoutContainer) {
    if(child.node && child.node.parentElement) {
      this.node.removeChild(child.node.parentElement);
    }
    this.node.dataset.mode = '';
    super.takeDownChild(child);
  }

  persist() {
    return Object.assign(super.persist(), {
      type: 'lineup',
      stackLayout: this.options.stackLayout
    });
  }

  static restore(dump: ILayoutDump, restore: (dump: ILayoutDump) => ILayoutContainer, doc: Document) {
    const options = Object.assign(ALayoutContainer.restoreOptions(dump), {
      orientation: EOrientation[<any>dump.orientation],
      stackLayout: dump.stackLayout
    });
    const r = new LineUpLayoutContainer(doc, options);
    if(dump.children) {
      dump.children.forEach((d) => r.push(restore(d)));
    }
    return r;
  }

  static derive(node: HTMLElement, derive: (node: HTMLElement) => ILayoutContainer) {
    const children = Array.from(node.children);
    console.assert(children.length >= 1);

    const deriveOrientation = () => {
      if (node.dataset.layout && (node.dataset.layout.startsWith('v') || (node.dataset.orientation && node.dataset.orientation.startsWith('v')))) {
        return EOrientation.VERTICAL;
      }
      return EOrientation.HORIZONTAL;
    };
    const options = Object.assign(ALayoutContainer.deriveOptions(node), {
      orientation: deriveOrientation(),
      stackLayout: node.dataset.mode === 'stacked' || (node.dataset.layout && node.dataset.layout.endsWith('stack'))
    });
    const r = new LineUpLayoutContainer(<Document>node.ownerDocument, options);
    children.forEach((c) => r.push(derive(<HTMLElement>c)));
    return r;
  }

  defaultOptions() {
    return Object.assign(super.defaultOptions(), {
      stackLayout: false
    });
  }
}
