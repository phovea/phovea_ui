/**
 * this package contains utilities for creating flexible layouts based on the builder pattern
 */

import './style.scss';

export {IView, ILayoutContainer, ILayoutParentContainer, ISize, LayoutContainerEvents, IRootLayoutContainer, ITabbingLayoutContainer, IViewLayoutContainer, ISplitLayoutContainer, ILayoutDump} from './interfaces';
export {horizontalLineUp, verticalLineUp, tabbing, horizontalSplit, verticalSplit, root, view} from './builder';

