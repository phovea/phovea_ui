import {ILayoutContainer, ILayoutParentContainer, IView} from './interfaces';

export default class ViewLayoutContainer implements ILayoutContainer {
  parent: ILayoutParentContainer | null;

  constructor(public readonly view: IView) {

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

  get node() {
    return this.view.node;
  }

  resized() {
    this.view.resized();
  }

  destroy() {
    this.view.destroy();
  }
}
