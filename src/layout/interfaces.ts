import {IEventHandler} from 'phovea_core/src/event';

export declare type ISize = [number, number];

export enum EOrientation {
  HORIZONTAL,
  VERTICAL
}

export interface ILayoutContainer extends IEventHandler {
  parent: ILayoutParentContainer | null;
  readonly node: HTMLElement;

  readonly minSize: ISize;

  name: string;

  resized(): void;

  destroy(): void;

  visible: boolean;
}

export interface ILayoutParentContainer extends ILayoutContainer, Iterable<ILayoutContainer> {
  readonly children: ILayoutContainer[];

  readonly length: number;

  forEach(callback: (child: ILayoutContainer, index: number) => void): void;

  push(child: ILayoutContainer): boolean;

  remove(child: ILayoutContainer): boolean;

  readonly minChildCount: number;
}

export interface IView {
  readonly node: HTMLElement;
  readonly minSize: ISize;

  visible: boolean;

  destroy(): void;

  resized(): void;
}

export function isView(view: IView & object) {
  const base = typeof view.visible === 'boolean' && typeof Array.isArray(view.minSize) && typeof view.destroy === 'function' && typeof view.resized === 'function' && view.hasOwnProperty('node');
  // ILayoutContainer
  const not = view.hasOwnProperty('parent');
  return base && !not;
}
