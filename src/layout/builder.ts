import {EOrientation, ILayoutContainer, isView, IView} from './interfaces';
import ViewLayoutContainer, {HTMLView} from './ViewLayoutContainer';
import SplitLayoutContainer from './SplitLayoutContainer';
import LineUpLayoutContainer from './LineUpLayoutContainer';
import TabbingLayoutContainer from './TabbingLayoutContainer';

type IBuildAble = (ABuilder | string | IView | HTMLElement);

abstract class ABuilder {
  constructor(protected readonly children: IBuildAble[]) {

  }

  push(view: IBuildAble) {
    this.children.push(view);
    return this;
  }

  protected buildChildren(doc: Document): ILayoutContainer[] {
    return this.children.map((c) => {
      if (typeof c === 'string') {
        const node = doc.createElement('article');
        node.innerHTML = c;
        return new ViewLayoutContainer(new HTMLView(node));
      }
      if (c instanceof ABuilder) {
        return c.build(doc);
      }
      if (isView(<IView>c)) {
        return new ViewLayoutContainer(<IView>c);
      }
      //HTMLElement only option remaining
      return new ViewLayoutContainer(new HTMLView(<HTMLElement>c));
    });
  }

  abstract build(doc?: Document): ILayoutContainer;
}

export class SplitBuilder extends ABuilder {
  private _ratio: number = 0.5;

  constructor(private readonly orientation: EOrientation, ratio: number, left: IBuildAble, right: IBuildAble) {
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
    const r = new SplitLayoutContainer(doc, this.orientation, this._ratio, built[0], built[1]);
    built.slice(2).forEach((c) => r.push(c));
    return r;
  }
}

export class LineUpBuilder extends ABuilder {

  constructor(private readonly orientation: EOrientation, children: IBuildAble[]) {
    super(children);
  }

  build(doc = document) {
    const built = this.buildChildren(doc);
    return new LineUpLayoutContainer(doc, this.orientation, ...built);
  }
}

export class TabbingBuilder extends ABuilder {
  build(doc = document) {
    const built = this.buildChildren(doc);
    return new TabbingLayoutContainer(doc, ...built);
  }
}

export function horizontalSplit(ratio: number, left: IBuildAble, right: IBuildAble): SplitBuilder {
  return new SplitBuilder(EOrientation.HORIZONTAL, ratio, left, right);
}

export function verticalSplit(ratio: number, left: IBuildAble, right: IBuildAble): SplitBuilder {
  return new SplitBuilder(EOrientation.VERTICAL, ratio, left, right);
}

export function horizontalLineUp(...children: IBuildAble[]): LineUpBuilder {
  return new LineUpBuilder(EOrientation.HORIZONTAL, children);
}

export function verticalLineUp(...children: IBuildAble[]): LineUpBuilder {
  return new LineUpBuilder(EOrientation.VERTICAL, children);
}

export function tabbing(...children: IBuildAble[]): TabbingBuilder {
  return new TabbingBuilder(children);
}

