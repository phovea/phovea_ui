import {EOrientation, ILayoutContainer, ILayoutDump, IView} from './interfaces';
import ViewLayoutContainer, {HTMLView} from './internal/ViewLayoutContainer';
import SplitLayoutContainer, {ISplitLayoutContainerOptions} from './internal/SplitLayoutContainer';
import LineUpLayoutContainer, {ILineUpLayoutContainerOptions} from './internal/LineUpLayoutContainer';
import TabbingLayoutContainer, {ITabbingLayoutContainerOptions} from './internal/TabbingLayoutContainer';
import RootLayoutContainer from './internal/RootLayoutContainer';
import {ILayoutContainerOption} from './internal/ALayoutContainer';


declare type IBuildAbleOrViewLike = ABuilder | IView | string;

function toBuilder(view: IBuildAbleOrViewLike): ABuilder {
  if (view instanceof ABuilder) {
    return view;
  }
  return new ViewBuilder(<IView | string>view);
}

abstract class ABuilder {
  protected _name: string = 'View';
  protected _fixed: boolean = false;

  name(name: string) {
    this._name = name;
    return this;
  }

  /**
   * if set then is the view not closeable
   * @return {ABuilder}
   */
  fixed() {
    this._fixed = true;
    return this;
  }

  protected buildOptions(): Partial<ILayoutContainerOption> {
    return {
      name: this._name,
      fixed: this._fixed
    };
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

  protected push(view: IBuildAbleOrViewLike) {
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

  protected buildOptions(): Partial<ISplitLayoutContainerOptions> {
    return Object.assign({
      orientation: this.orientation
    }, super.buildOptions());
  }

  build(root: RootLayoutContainer, doc = document) {
    const built = this.buildChildren(root, doc);
    console.assert(built.length >= 2);
    const r = new SplitLayoutContainer(doc, this.buildOptions(), this._ratio, built[0], built[1]);
    built.slice(2).forEach((c) => r.push(c));
    return r;
  }
}

class LineUpBuilder extends AParentBuilder {

  constructor(private readonly orientation: EOrientation, children: IBuildAbleOrViewLike[]) {
    super(children);
  }

  push(view: IBuildAbleOrViewLike) {
    return super.push(view);
  }

  protected buildOptions(): Partial<ILineUpLayoutContainerOptions> {
    return Object.assign({
      orientation: this.orientation
    }, super.buildOptions());
  }

  build(root: RootLayoutContainer, doc = document) {
    const built = this.buildChildren(root, doc);
    return new LineUpLayoutContainer(doc, this.buildOptions(), ...built);
  }
}

class TabbingBuilder extends AParentBuilder {
  private _active: number | null = null;

  push(view: IBuildAbleOrViewLike) {
    return super.push(view);
  }

  active(view: IBuildAbleOrViewLike) {
    this._active = this.children.length;
    return super.push(view);
  }

  protected buildOptions(): Partial<ITabbingLayoutContainerOptions> {
    return Object.assign({
      active: this._active
    }, super.buildOptions());
  }

  build(root: RootLayoutContainer, doc) {
    const built = this.buildChildren(root, doc);
    return new TabbingLayoutContainer(doc, this.buildOptions(), ...built);
  }
}

export class ViewBuilder extends ABuilder {
  constructor(private readonly view: string | IView | HTMLElement) {
    super();
  }

  build(root: RootLayoutContainer, doc: Document): ILayoutContainer {
    const options = this.buildOptions();
    if (typeof this.view === 'string') {
      return new ViewLayoutContainer(new HTMLView(this.view, doc), options);
    }
    return new ViewLayoutContainer(<IView>this.view, options);
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

export function restore(dump: ILayoutDump, restoreView: (referenceId: number) => IView, doc = document): ILayoutContainer {
  const restorer = (d: ILayoutDump) => restore(d, restoreView, doc);
  switch (dump.type) {
    case 'root':
      return RootLayoutContainer.restore(dump, restorer, doc);
    case 'split':
      return SplitLayoutContainer.restore(dump, restorer, doc);
    case 'lineup':
      return LineUpLayoutContainer.restore(dump, restorer, doc);
    case 'tabbing':
      return TabbingLayoutContainer.restore(dump, restorer, doc);
    case 'view':
      return ViewLayoutContainer.restore(dump, restoreView, doc);
    default:
      throw new Error(`invalid type: ${dump.type}`);
  }
}
