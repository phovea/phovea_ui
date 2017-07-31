import {EOrientation, ILayoutContainer, isView, IView} from './interfaces';
import ViewLayoutContainer, {HTMLView} from './internal/ViewLayoutContainer';
import SplitLayoutContainer from './internal/SplitLayoutContainer';
import LineUpLayoutContainer from './internal/LineUpLayoutContainer';
import TabbingLayoutContainer from './internal/TabbingLayoutContainer';
import RootLayoutContainer from './internal/RootLayoutContainer';


declare type IBuildAbleOrViewLike = ABuilder | HTMLElement | IView | string;

function toBuilder(view: IBuildAbleOrViewLike): ABuilder {
  if (view instanceof ABuilder) {
    return view;
  }
  return new ViewBuilder(<HTMLElement | IView | string>view);
}

abstract class ABuilder {
  protected _name: string = 'View';

  name(name: string) {
    this._name = name;
    return this;
  }

  abstract build(root: RootLayoutContainer, doc: Document): ILayoutContainer;
}

abstract class AParentBuilder extends ABuilder {
  protected readonly children: ABuilder[] = [];

  constructor(children: IBuildAbleOrViewLike[]) {
    super();
    this._name = 'Container';
    children.forEach((c) => this.push(c));
  }

  push(view: IBuildAbleOrViewLike) {
    this.children.push(toBuilder(view));
    return this;
  }

  protected buildChildren(root: RootLayoutContainer, doc: Document): ILayoutContainer[] {
    return this.children.map((c) => c.build(root, doc));
  }
}

class SplitBuilder extends AParentBuilder {
  private _ratio: number = 0.5;

  constructor(private readonly orientation: EOrientation, ratio: number, left: IBuildAbleOrViewLike, right: IBuildAbleOrViewLike) {
    super([left, right]);
    this._ratio = ratio;
  }

  ratio(ratio: number) {
    this._ratio = ratio;
    return this;
  }

  build(root: RootLayoutContainer, doc = document) {
    const built = this.buildChildren(root, doc);
    console.assert(built.length >= 2);
    const r = new SplitLayoutContainer(doc, this._name, this.orientation, this._ratio, built[0], built[1]);
    built.slice(2).forEach((c) => r.push(c));
    return r;
  }
}

class LineUpBuilder extends AParentBuilder {

  constructor(private readonly orientation: EOrientation, children: IBuildAbleOrViewLike[]) {
    super(children);
  }

  build(root: RootLayoutContainer, doc = document) {
    const built = this.buildChildren(root, doc);
    return new LineUpLayoutContainer(doc, this._name, this.orientation, ...built);
  }
}

class TabbingBuilder extends AParentBuilder {
  build(root: RootLayoutContainer, doc) {
    const built = this.buildChildren(root, doc);
    return new TabbingLayoutContainer(doc, this._name, ...built);
  }
}

export class ViewBuilder extends ABuilder {
  constructor(private readonly view: string | IView | HTMLElement) {
    super();
  }

  build(root: RootLayoutContainer, doc: Document): ILayoutContainer {
    if (typeof this.view === 'string') {
      //HTML
      const d = doc.createElement('article');
      d.innerHTML = this.view;
      return new ViewLayoutContainer(this._name, new HTMLView(d));
    }
    if (isView(<IView>this.view)) {
      return new ViewLayoutContainer(this._name, <IView>this.view);
    }
    //HTMLElement
    return new ViewLayoutContainer(this._name, new HTMLView(<HTMLElement>this.view));
  }
}

export function horizontalSplit(ratio: number, left: IBuildAbleOrViewLike, right: IBuildAbleOrViewLike): SplitBuilder {
  return new SplitBuilder(EOrientation.HORIZONTAL, ratio, left, right);
}

export function verticalSplit(ratio: number, left: IBuildAbleOrViewLike, right: IBuildAbleOrViewLike): SplitBuilder {
  return new SplitBuilder(EOrientation.VERTICAL, ratio, left, right);
}

export function horizontalLineUp(...children: IBuildAbleOrViewLike[]): LineUpBuilder {
  return new LineUpBuilder(EOrientation.HORIZONTAL, children);
}

export function verticalLineUp(...children: IBuildAbleOrViewLike[]): LineUpBuilder {
  return new LineUpBuilder(EOrientation.VERTICAL, children);
}

export function tabbing(...children: IBuildAbleOrViewLike[]): TabbingBuilder {
  return new TabbingBuilder(children);
}

export function view(view: string | IView | HTMLElement): ViewBuilder {
  return new ViewBuilder(view);
}

export function root(child: IBuildAbleOrViewLike, doc = document): ILayoutContainer {
  const b = toBuilder(child);
  const r = new RootLayoutContainer(doc);
  r.setRoot(b.build(r, doc));
  return r;
}
