import {IEventHandler} from 'phovea_core/src/event';
import {IHasUniqueId} from 'phovea_core/src/idtype';

export declare type ISize = [number, number];

export enum EOrientation {
  HORIZONTAL,
  VERTICAL
}

export type IDropArea = 'center' | 'left' | 'right' | 'top' | 'bottom';

export interface ILayoutContainer extends IEventHandler, IHasUniqueId {
  parent: ILayoutParentContainer | null;
  readonly node: HTMLElement;
  readonly header: HTMLElement;
  readonly minSize: ISize;
  readonly hideAbleHeader: boolean;
  name: string;
  visible: boolean;

  resized(): void;

  destroy(): void;

  persist(): ILayoutDump;

  find(id: number): ILayoutContainer | null;
}

export interface ILayoutDump {
  type: string;
  name: string;
  children?: ILayoutDump[];

  [key: string]: any;
}

export interface ILayoutParentContainer extends ILayoutContainer, Iterable<ILayoutContainer> {
  readonly children: ILayoutContainer[];

  readonly length: number;

  forEach(callback: (child: ILayoutContainer, index: number) => void): void;

  push(child: ILayoutContainer): boolean;

  replace(child: ILayoutContainer, replacement: ILayoutContainer): boolean;

  remove(child: ILayoutContainer): boolean;
}

export interface IView {
  readonly node: HTMLElement;
  readonly minSize: ISize;

  visible: boolean;

  destroy(): void;

  resized(): void;

  dumpReference(): number;
}
