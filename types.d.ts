declare module "@splidejs/react-splide" {
  import React from "react";

  export interface SplideProps extends React.HTMLAttributes<HTMLDivElement> {
    options?: any;
    hasTrack?: boolean;
    tag?: string;
    className?: string;
    id?: string;
    onMounted?: (splide: any) => void;
    onArrowsMounted?: (splide: any, prev: HTMLButtonElement, next: HTMLButtonElement) => void;
    onPaginationMounted?: (splide: any, data: any) => void;
    onActive?: (splide: any, Slide: any) => void;
    onInactive?: (splide: any, Slide: any) => void;
    onVisible?: (splide: any, Slide: any) => void;
    onHidden?: (splide: any, Slide: any) => void;
    onAnimated?: (splide: any) => void;
    onMoved?: (splide: any, index: number, prev: number) => void;
    onMove?: (splide: any, index: number, prev: number) => void;
    onScroll?: (splide: any) => void;
    onScrolled?: (splide: any) => void;
    onClick?: (splide: any, Slide: any, e: MouseEvent) => void;
  }

  export class Splide extends React.Component<SplideProps, any> {}
  export class SplideSlide extends React.Component<React.HTMLAttributes<HTMLDivElement>, any> {}
  export class SplideTrack extends React.Component<React.HTMLAttributes<HTMLDivElement>, any> {}
}
