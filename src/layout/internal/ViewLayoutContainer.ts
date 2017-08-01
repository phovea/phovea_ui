import {ILayoutContainer, ILayoutDump, ISize, IView} from '../interfaces';
import {ALayoutContainer, ILayoutContainerOption} from './ALayoutContainer';
import {dropViews} from './utils';

export default class ViewLayoutContainer extends ALayoutContainer<ILayoutContainerOption> implements ILayoutContainer {

  readonly node: HTMLElement;

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
    this.view.visible = visible;
  }

  get minSize() {
    return this.view.minSize;
  }

  resized() {
    this.view.resized();
  }

  destroy() {
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
