import {AParentLayoutContainer} from './AParentLayoutContainer';
import {EOrientation, ILayoutContainer, ILayoutDump, ISize} from '../interfaces';
import {ALayoutContainer, ILayoutContainerOption} from 'phovea_ui/src/layout/internal/ALayoutContainer';


export interface ISplitLayoutContainerOptions extends ILayoutContainerOption {
  readonly orientation: EOrientation;
}


export default class SplitLayoutContainer extends AParentLayoutContainer<ISplitLayoutContainerOptions> {
  private static readonly SEPARATOR = `<div data-layout="separator"/>`;
  private static readonly SEPARATOR_WIDTH = 5;

  readonly minChildCount = 2;

  private readonly _ratios: number[] = [];

  constructor(document: Document, options: Partial<ISplitLayoutContainerOptions>, ratio: number, child1: ILayoutContainer, child2: ILayoutContainer) {
    super(document, options);
    console.assert(ratio >= 0 && ratio <= 1);
    this.node.dataset.layout = 'split';
    this.node.dataset.orientation = this.options.orientation === EOrientation.HORIZONTAL ? 'h' : 'v';

    this.node.addEventListener('mousedown', (evt) => {
      if (this.isSeparator(<HTMLElement>evt.target)) {
        //dragging
        const index = Math.floor(Array.from(this.node.children).indexOf(<HTMLElement>evt.target) / 2);
        this.enableDragging(index);
      }
    });

    this.push(child1, ratio);
    this.push(child2, 1 - ratio);
  }

  defaultOptions() {
    return Object.assign(super.defaultOptions(), {
      orientation: EOrientation.HORIZONTAL
    });
  }

  get hideAbleHeader() {
    return !this.options.closeAble;
  }

  private isSeparator(elem: HTMLElement) {
    return elem.parentElement === this.node && elem.dataset.layout === 'separator';
  }

  private enableDragging(index: number) {
    const mouseMove = (evt: MouseEvent) => {
      const ratio = this.options.orientation === EOrientation.HORIZONTAL ? evt.x / this.node.offsetWidth : evt.y / this.node.offsetHeight;
      this.setRatio(index, ratio);
      evt.stopPropagation();
      evt.preventDefault();
    };
    const disable = (evt: MouseEvent) => {
      if (evt.target !== evt.currentTarget && evt.type === 'mouseleave') {
        return;
      }
      this.node.removeEventListener('mousemove', mouseMove);
      this.node.removeEventListener('mouseup', disable);
      this.node.removeEventListener('mouseleave', disable);
    };
    this.node.addEventListener('mousemove', mouseMove);
    this.node.addEventListener('mouseup', disable);
    this.node.addEventListener('mouseleave', disable);
  }

  setRatio(index: number, ratio: number) {
    console.assert(ratio >= 0 && ratio <= 1);
    const old = this._ratios[index];
    const others = this._ratios.reduce((a, r) => a + r, -old);
    const factor = (others + (old - ratio)) / others;
    this._ratios.forEach((r, i) => this._ratios[i] = r * factor);
    this._ratios[index] = ratio;
    this.updateRatios();
  }

  private updateRatios() {
    const sum = this._ratios.reduce((a, r) => a + r, 0);
    const act = this._ratios.map((r) => Math.round((r / sum) * 100));
    this.forEach((c, i) => c.node.parentElement.style.flex = `${act[i]} ${act[i]} auto`);
  }

  get ratios() {
    return this._ratios.slice();
  }

  get minSize() {
    console.assert(this.length > 1);
    const padding = (this.length - 1) * SplitLayoutContainer.SEPARATOR_WIDTH;
    switch (this.options.orientation) {
      case EOrientation.HORIZONTAL:
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [a[0] + cmin[0], Math.max(a[1], cmin[1])];
        }, [padding, 0]);
      case EOrientation.VERTICAL: {
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [Math.max(a[0], cmin[0]), a[1] + cmin[1]];
        }, [padding, 0]);
      }
    }
  }

  push(child: ILayoutContainer, ratio: number = 0) {
    const r = super.push(child);
    if (this.length > 1) {
      this.node.insertAdjacentHTML('beforeend', SplitLayoutContainer.SEPARATOR);
    }
    this.node.appendChild(wrap(child));
    this._ratios.push(ratio);
    this.updateRatios();
    return r;
  }

  remove(child: ILayoutContainer) {
    const wrapper = child.node.parentElement;
    //in case of the first one use the next one since the next child is going to be the first one
    const separator = wrapper.previousElementSibling || wrapper.nextElementSibling;
    if (separator) {
      separator.remove();
    }
    child.node.remove();
    child.header.remove();
    wrapper.remove();
    const index = this._children.indexOf(child);
    this._ratios.splice(index, 1);
    const r = super.remove(child);
    this.updateRatios();
    return r;
  }

  persist() {
    return Object.assign(super.persist(), {
      type: 'split',
      orientation: EOrientation[this.options.orientation],
      ratios: this.ratios,
    });
  }

  static restore(dump: ILayoutDump, restore: (dump: ILayoutDump)=>ILayoutContainer, doc: Document) {
    console.assert(dump.children.length >= 2);
    const ratios = dump.ratios;
    const options = Object.assign(ALayoutContainer.restoreOptions(dump), {
      orientation: EOrientation[<string>dump.orientation]
    });
    const r = new SplitLayoutContainer(doc, options, ratios[0], restore(dump.children[0]), restore(dump.children[0]));
    dump.children.slice(2).forEach((d, i) => r.push(restore(d), ratios[i + 2]));
    return r;
  }
}

function wrap(child: ILayoutContainer) {
  const s = child.node.ownerDocument.createElement('section');
  if (!child.hideAbleHeader) {
    s.appendChild(child.header);
  }
  s.appendChild(child.node);
  return s;
}
