
export declare type ISize = [number, number];

export interface ILayoutContainer {
  parent: ILayoutParentContainer | null;
  readonly node: HTMLElement;

  readonly minSize: ISize;

  resized(): void;

  destroy(): void;

  visible: boolean;
}

export interface ILayoutParentContainer extends ILayoutContainer, Iterable<ILayoutContainer> {
  readonly children: ILayoutContainer[];

  readonly length: number;

  forEach(callback: (child: ILayoutContainer, index: number)=>void): void;

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
