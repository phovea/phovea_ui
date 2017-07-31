import {EOrientation, ILayoutContainer, isView, IView} from './interfaces';
import ViewLayoutContainer, {HTMLView} from './ViewLayoutContainer';
import SplitLayoutContainer from './SplitLayoutContainer';
import LineUpLayoutContainer from './LineUpLayoutContainer';
import TabbingLayoutContainer from './TabbingLayoutContainer';


interface IBuildAble {
  build(doc?: Document);
}

declare type IBuildAbleOrViewLike = IBuildAble|HTMLElement|IView|string;

abstract class ABuilder implements IBuildAble {
  protected _name: string = 'Container';
  protected readonly children: IBuildAble[] = [];


  constructor(children: IBuildAbleOrViewLike[]) {
    children.forEach((c) => this.push(c));
  }

  name(name: string) {
    this._name = name;
    return this;
  }

  push(view: IBuildAbleOrViewLike) {
    if (typeof (<IBuildAble>view).build !== 'function') {
      view = new ViewBuilder(<HTMLElement|IView|string>view);
    }
    this.children.push(<IBuildAble>view);
    return this;
  }

  protected buildChildren(doc: Document): ILayoutContainer[] {
    return this.children.map((c) => c.build(doc));
  }

  abstract build(doc?: Document): ILayoutContainer;
}

class SplitBuilder extends ABuilder {
  private _ratio: number = 0.5;

  constructor(private readonly orientation: EOrientation, ratio: number, left: IBuildAbleOrViewLike, right: IBuildAbleOrViewLike) {
    super([left, right]);
    this._ratio = ratio;
  }

  ratio(ratio: number) {
    this._ratio = ratio;
    return this;
  }

  build(doc = document) {
    const built = this.buildChildren(doc);
    console.assert(built.length >= 2);
    const r = new SplitLayoutContainer(doc, this._name, this.orientation, this._ratio, built[0], built[1]);
    built.slice(2).forEach((c) => r.push(c));
    return r;
  }
}

class LineUpBuilder extends ABuilder {

  constructor(private readonly orientation: EOrientation, children: IBuildAbleOrViewLike[]) {
    super(children);
  }

  build(doc = document) {
    const built = this.buildChildren(doc);
    return new LineUpLayoutContainer(doc, this._name, this.orientation, ...built);
  }
}

class TabbingBuilder extends ABuilder {
  build(doc = document) {
    const built = this.buildChildren(doc);
    return new TabbingLayoutContainer(doc, this._name, ...built);
  }
}

export class ViewBuilder implements IBuildAble {
  protected _name: string = 'View';

  constructor(private readonly view: string | IView | HTMLElement) {

  }

  name(name: string) {
    this._name = name;
    return this;
  }

  build(doc: Document = document): ILayoutContainer {
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
