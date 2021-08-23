/**
 * Created by Samuel Gratzl on 01.08.2017.
 */
import { ALayoutContainer } from './ALayoutContainer';
import { TabbingLayoutContainer } from './TabbingLayoutContainer';
import { IDropArea } from '../interfaces';
import { ILayoutContainer } from '../interfaces';
export declare class Dropper {
    static determineDropArea(x: number, y: number): IDropArea;
    static dropViews(node: HTMLElement, reference: ALayoutContainer<any> & ILayoutContainer): void;
    static dropLogic(item: ILayoutContainer, reference: ALayoutContainer<any> & ILayoutContainer, area: IDropArea): any;
    static autoWrap(item: ILayoutContainer): TabbingLayoutContainer | ILayoutContainer;
}
