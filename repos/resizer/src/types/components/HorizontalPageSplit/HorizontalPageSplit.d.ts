import { HTMLAttributes } from 'react';
import { BoundingSize } from '../../dom';
import { PageSplitEvents } from '../../event';
import { UsePageSplitPropsDivider, UsePageSplitPropsPanel } from '../../hooks';
import { Resize } from '../../resize';
import { PanelSize, PanelSizeProperty } from '../../state';
export interface HorizontalPageSplitProps<T extends Element = HTMLDivElement, P extends Element = HTMLDivElement, D extends Element = HTMLSpanElement> extends PageSplitEvents, HTMLAttributes<T> {
    /**
     * Calculates the bounding size of each panel.
     *
     * Defaults to {@link HorizontalBoundingSize}.
     */
    readonly boundingSize?: BoundingSize;
    /**
     * Creates a new {@link Panel}.
     *
     * Defaults to {@link HorizontalPanel}.
     */
    readonly panel?: UsePageSplitPropsPanel<P>;
    /**
     * Creates a new {@link Divider}.
     *
     * Defaults to {@link HorizontalDivider}.
     */
    readonly divider?: UsePageSplitPropsDivider<D>;
    /**
     * The strategy of resizes.
     *
     * Defaults to {@link Proportional}.
     */
    readonly resize?: Resize;
    /**
     * Sets the inline CSS property used to set the width of each panel.
     *
     * Defaults to <code>flexBasis</code>.
     */
    readonly widthProperty?: PanelSizeProperty;
    /**
     * Sets the initial width of each panel.
     */
    readonly widths?: PanelSize[];
}
export declare function HorizontalPageSplit<P extends Element = HTMLDivElement, D extends Element = HTMLSpanElement>(props: HorizontalPageSplitProps<HTMLDivElement, P, D>): JSX.Element;
