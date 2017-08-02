import {IEventHandler} from 'phovea_core/src/event';
import {IHasUniqueId} from 'phovea_core/src/idtype';

/**
 * [width, height]
 */
export declare type ISize = [number, number];

/**
 * base interface for the container
 */
export interface ILayoutContainer extends IEventHandler, IHasUniqueId {
  parent: ILayoutParentContainer | null;
  /**
   * HTML node managed by this container
   */
  readonly node: HTMLElement;
  /**
   * HTML header node managed by this container
   */
  readonly header: HTMLElement;
  /**
   * minimum size of this container
   */
  readonly minSize: ISize;
  /**
   * can the header be hidden if needed
   */
  readonly hideAbleHeader: boolean;
  /**
   * name of this container
   */
  name: string;
  /**
   * visibility state of this container
   */
  visible: boolean;

  resized(): void;

  destroy(): void;

  persist(): ILayoutDump;

  find(id: number): ILayoutContainer | null;
}

export interface ILayoutDump {
  /**
   * container tpye
   */
  type: string;
  /**
   * container name
   */
  name: string;
  /**
   * optional list of children
   */
  children?: ILayoutDump[];

  [key: string]: any;
}

export interface ILayoutParentContainer extends ILayoutContainer, Iterable<ILayoutContainer> {
  readonly children: ILayoutContainer[];

  readonly length: number;

  forEach(callback: (child: ILayoutContainer, index: number) => void): void;

  /**
   * adds another child to the container
   * @param {ILayoutContainer} child the child to push
   * @return {boolean} true if successful
   */
  push(child: ILayoutContainer): boolean;

  /**
   * replaces one child with another
   * @param {ILayoutContainer} child the child to replace
   * @param {ILayoutContainer} replacement replace with
   * @return {boolean} true if successful
   */
  replace(child: ILayoutContainer, replacement: ILayoutContainer): boolean;

  /**
   * removes a child from the container
   * @param {ILayoutContainer} child the child to remove
   * @return {boolean} true if successful
   */
  remove(child: ILayoutContainer): boolean;
}

/**
 * interface for the actual view
 */
export interface IView {
  /**
   * HTMLElement of this view
   */
  readonly node: HTMLElement;
  readonly minSize: ISize;

  visible: boolean;

  destroy(): void;

  resized(): void;

  /**
   * determines the unique reference of this view for dumping
   * @return {number} the uid of this view
   */
  dumpReference(): number;
}
