import { HTMLAttributes } from 'react';
import { BoundingSize } from '../../dom';
import { PageSplitEvents } from '../../event';
import { UsePageSplitPropsDivider, UsePageSplitPropsPanel } from '../../hooks';
import { Resize } from '../../resize';
import { PanelSize, PanelSizeProperty } from '../../state';
export interface VerticalPageSplitProps<T extends Element = HTMLDivElement, P extends Element = HTMLDivElement, D extends Element = HTMLSpanElement> extends PageSplitEvents, HTMLAttributes<T> {
    /**
     * Calculates the bounding size of each panel.
     *
     * Defaults to {@link VerticalBoundingSize}.
     */
    readonly boundingSize?: BoundingSize;
    /**
     * Creates a new {@link Panel}.
     *
     * Defaults to {@link VerticalPanel}.
     */
    readonly panel?: UsePageSplitPropsPanel<P>;
    /**
     * Creates a new {@link Divider}.
     *
     * Defaults to {@link VerticalDivider}.
     */
    readonly divider?: UsePageSplitPropsDivider<D>;
    /**
     * The strategy of resizes.
     *
     * Defaults to {@link Proportional}.
     */
    readonly resize?: Resize;
    /**
     * Sets the inline CSS property used to set the height of each panel.
     *
     * Defaults to <code>flexBasis</code>.
     */
    readonly heightProperty?: PanelSizeProperty;
    /**
     * Sets the initial height of each panel.
     */
    readonly heights?: PanelSize[];
}
export declare function VerticalPageSplit<P extends Element = HTMLDivElement, D extends Element = HTMLSpanElement>(props: VerticalPageSplitProps<HTMLDivElement, P, D>): JSX.Element;
