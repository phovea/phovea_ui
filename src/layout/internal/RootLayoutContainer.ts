import {AParentLayoutContainer} from './AParentLayoutContainer';
import {ILayoutContainer, ILayoutDump, IRootLayoutContainer, LayoutContainerEvents} from '../interfaces';
import TabbingLayoutContainer from './TabbingLayoutContainer';
import {ILayoutContainerOption} from './ALayoutContainer';
import {IDropArea} from './interfaces';
import {IBuildAbleOrViewLike} from '../builder';
import {IView} from '../';

export default class RootLayoutContainer extends AParentLayoutContainer<ILayoutContainerOption> implements IRootLayoutContainer {
  readonly minChildCount = 0;
  readonly type = 'root';

  private viewDump: {
    viewSibling: HTMLElement,
    headerSibling: HTMLElement
  };

  constructor(document: Document, public readonly build: (layout: IBuildAbleOrViewLike)=> ILayoutContainer, private readonly restorer: (dump: ILayoutDump, restoreView: (referenceId: number) => IView) => ILayoutContainer) {
    super(document, {
      name: '',
      fixed: true
    });
    this.node.dataset.layout = 'root';
    this.visible = true;

    this.on(LayoutContainerEvents.EVENT_MAXIMIZE, (evt) => {
      // maximize views
      const view = evt.args[0];

      const section = document.createElement('section');
      section.classList.add('maximized-view');

      this.viewDump = {
        viewSibling: view.node.nextElementSibling,
        headerSibling: view.header.nextElementSibling
      };

      section.appendChild(view.header);
      section.appendChild(view.node);
      this.node.insertAdjacentElement('afterbegin', section);
    });

    this.on(LayoutContainerEvents.RESTORE_SIZE, (evt) => {
      const view = evt.args[0];
      const parent = view.parent;

      parent.node.insertBefore(view.node, this.viewDump.viewSibling);
      parent.header.insertBefore(view.header, this.viewDump.headerSibling);

      this.node.querySelector('.maximized-view').remove();
    });
  }

  set root(root: ILayoutContainer) {
    if (this._children.length > 0) {
      this.replace(this.root, root);
    } else {
      this.push(root);
    }
  }

  get root() {
    return this._children[0];
  }

  get minSize() {
    return this._children[0].minSize;
  }

  protected addedChild(child: ILayoutContainer, index: number) {
    super.addedChild(child, index);
    if (child instanceof TabbingLayoutContainer) {
      //need the header
      this.node.appendChild(child.header);
    }
    this.node.appendChild(child.node);
    child.visible = this.visible;
  }

  place(child: ILayoutContainer, reference: ILayoutContainer, area: IDropArea) {
    return this.push(child);
  }

  protected takeDownChild(child: ILayoutContainer) {
    if (child instanceof TabbingLayoutContainer) {
      this.node.removeChild(child.header);
    }
    this.node.removeChild(child.node);
    super.takeDownChild(child);
  }

  restore(dump: ILayoutDump, restoreView: (referenceId: number) => IView) {
    console.assert(dump.type === 'root');
    this.clear();
    const children = (dump.children || []).map((dump) => this.restorer(dump, restoreView));
    if (children.length === 0) {
      return;
    }
    this.root = children[0];
    children.slice(1).forEach((c) => this.push(c));
  }

  persist() {
    return Object.assign(super.persist(), {
      type: 'root'
    });
  }

  static restore(dump: ILayoutDump, doc: Document, build: IBuildLayout, restorer: IRestoreLayout, restoreView: IViewRestorer) {
    const r = new RootLayoutContainer(doc, (layout) => build(r, layout), restorer);
    r.restore(dump, restoreView);
    return r;
  }
}

interface IBuildLayout {
  (root: RootLayoutContainer, layout: IBuildAbleOrViewLike): ILayoutContainer;
}
interface IViewRestorer {
  (referenceId: number): IView;
}
interface IRestoreLayout {
  (dump: ILayoutDump, restoreView: IViewRestorer): ILayoutContainer;
}
