import { ILayoutDump, ISize, IView, IViewLayoutContainer } from '../interfaces';
import { ALayoutContainer, ILayoutContainerOption } from './ALayoutContainer';
export interface IViewLayoutContainerOptions extends ILayoutContainerOption {
    hideHeader: boolean;
}
export declare class HTMLView implements IView {
    readonly minSize: ISize;
    visible: boolean;
    readonly node: HTMLElement;
    constructor(html: string, doc: Document);
    destroy(): void;
    resized(): void;
    dumpReference(): number;
}
export declare class NodeView implements IView {
    readonly node: HTMLElement;
    readonly minSize: ISize;
    visible: boolean;
    constructor(node: HTMLElement);
    destroy(): void;
    resized(): void;
    dumpReference(): number;
}
export declare class ViewLayoutContainer extends ALayoutContainer<IViewLayoutContainerOptions> implements IViewLayoutContainer {
    readonly view: IView;
    readonly node: HTMLElement;
    readonly type = "view";
    constructor(view: IView, options: Partial<ILayoutContainerOption>);
    protected defaultOptions(): IViewLayoutContainerOptions & {
        hideHeader: boolean;
    };
    get hideAbleHeader(): boolean;
    get visible(): boolean;
    set visible(visible: boolean);
    get minSize(): ISize;
    resized(): void;
    destroy(): void;
    persist(): ILayoutDump;
    static restore(dump: ILayoutDump, restoreView: (referenceId: number) => IView, doc: Document): ViewLayoutContainer;
    static derive(view: IView): ViewLayoutContainer;
}
