import { PanelSize } from './PanelSize';
import { PanelSizeProperty } from './PanelSizeProperty';
export interface PageSplitPanelsState {
    readonly elements: readonly Element[];
    readonly sizes: readonly PanelSize[];
    readonly sizeProperty: PanelSizeProperty;
}
export declare const EmptyPanelsState: PageSplitPanelsState;
