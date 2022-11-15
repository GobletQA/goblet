import { HTMLAttributes, ReactElement } from 'react';
import { BoundingSize } from '../dom';
import { PageSplitEvents } from '../event';
import { Resize } from '../resize';
import { PageSplitDispatch, PageSplitState, PanelSize, PanelSizeProperty } from '../state';
import { UseDividerProps } from './useDivider';
import { UsePanelProps } from './usePanel';
export interface UsePageSplitPropsDivider<T extends Element> {
    (props: Pick<UseDividerProps<T>, 'index' | 'resizeInput'>): ReactElement<UseDividerProps<T>>;
}
export interface UsePageSplitPropsPanel<T extends Element> {
    (props: Pick<UsePanelProps<T>, 'index' | 'sizeProperty' | 'size' | 'children'>): ReactElement<UsePanelProps<T>>;
}
export interface UsePageSplitProps<T extends Element, P extends Element, D extends Element> extends PageSplitEvents, HTMLAttributes<T> {
    readonly boundingSize: BoundingSize;
    readonly panel: UsePageSplitPropsPanel<P>;
    readonly divider: UsePageSplitPropsDivider<D>;
    readonly resize?: Resize;
    readonly sizeProperty?: PanelSizeProperty;
    readonly sizes?: readonly PanelSize[];
}
export interface UsePageSplitReturnPanel<T extends Element> {
    (props: Pick<UsePanelProps<T>, 'index' | 'children'>): ReactElement<UsePanelProps<T>> | null;
}
export interface UsePageSplitReturnDivider<T extends Element> {
    (props: Pick<UseDividerProps<T>, 'index'>): ReactElement<UseDividerProps<T>> | null;
}
export interface UsePageSplitReturn<T extends Element, P extends Element, D extends Element> extends HTMLAttributes<T> {
    readonly panel: UsePageSplitReturnPanel<P>;
    readonly divider: UsePageSplitReturnDivider<D>;
    readonly state: PageSplitState;
    readonly dispatch: PageSplitDispatch;
}
export declare function usePageSplit<T extends Element, P extends Element, D extends Element>(props: UsePageSplitProps<T, P, D>): UsePageSplitReturn<T, P, D>;
