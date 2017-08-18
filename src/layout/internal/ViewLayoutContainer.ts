import {ILayoutDump, ISize, IView, IViewLayoutContainer} from '../interfaces';
import {ALayoutContainer, ILayoutContainerOption, withChanged} from './ALayoutContainer';
import {dropViews} from './dropper';
import {LayoutContainerEvents} from '../';

export default class ViewLayoutContainer extends ALayoutContainer<ILayoutContainerOption> implements IViewLayoutContainer {

  readonly node: HTMLElement;
  readonly type = 'view';

  constructor(public readonly view: IView, options: Partial<ILayoutContainerOption>) {
    super(view.node.ownerDocument, options);
    this.node = view.node.ownerDocument.createElement('article');
    this.node.dataset.layout = 'view';
    this.node.appendChild(view.node);

    const min = this.minSize;
    if (min[0] > 0) {
      view.node.style.minWidth = `${min[0]}px`;
    }
    if (min[1] > 0) {
      view.node.style.minHeight = `${min[1]}px`;
    }

    dropViews(this.node, this);
  }

  get visible() {
    return this.view.visible;
  }

  set visible(visible: boolean) {
    this.fire(withChanged(LayoutContainerEvents.EVENT_VISIBILITY_CHANGED), this.view.visible, this.view.visible = visible);
  }

  get minSize() {
    return this.view.minSize? this.view.minSize : <[number, number]>[0, 0];
  }

  resized() {
    this.view.resized();
  }

  destroy() {
    super.destroy();
    if (this.parent) {
      this.parent.remove(this);
    }
    this.view.destroy();
  }


  persist() {
    const r: ILayoutDump = Object.assign(super.persist(), {
      type: 'view'
    });
    if (this.view instanceof HTMLView) {
      r.html = this.view.node.innerHTML;
    } else {
      r.view = this.view.dumpReference();
    }
    return r;
  }


  static restore(dump: ILayoutDump, restoreView: (referenceId: number) => IView, doc: Document) {
    const view = dump.html ? new HTMLView(dump.html, doc) : restoreView(dump.view);
    return new ViewLayoutContainer(view, ALayoutContainer.restoreOptions(dump));
  }

  static derive(view: IView) {
    return new ViewLayoutContainer(view, ALayoutContainer.deriveOptions(view.node));
  }
}

export class HTMLView implements IView {
  readonly minSize: ISize = [0, 0];
  visible: boolean = true;
  readonly node: HTMLElement;

  constructor(html: string, doc: Document) {
    //HTML
    this.node = doc.createElement('div');
    this.node.innerHTML = html;
  }

  destroy() {
    //nothing to do
  }

  resized() {
    //nothing to do
  }

  dumpReference() {
    return -1;
  };
}



export class NodeView implements IView {
  readonly minSize: ISize = [0, 0];
  visible: boolean = true;

  constructor(public readonly node: HTMLElement) {
  }

  destroy() {
    //nothing to do
  }

  resized() {
    //nothing to do
  }

  dumpReference() {
    return -1;
  };
}
