/// <reference types="react" />
import { UsePageSplitProps } from '../../hooks';
export declare type PageSplitProps<T extends Element = HTMLDivElement, P extends Element = HTMLDivElement, D extends Element = HTMLSpanElement> = UsePageSplitProps<T, P, D>;
export declare function PageSplit<P extends Element = HTMLDivElement, D extends Element = HTMLDivElement>(props: PageSplitProps<HTMLDivElement, P, D>): JSX.Element;
