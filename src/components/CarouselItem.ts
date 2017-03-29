import { DOM, MouseEvent, StatelessComponent } from "react";
import * as classNames from "classnames";

export interface CarouselItemProps {
    url: string;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    status: ItemStatus;
    position: number;
    getItemNode?: (ref: HTMLElement) => void;
}

export type ItemStatus = "active" | "next" | "prev";

export const CarouselItem: StatelessComponent<CarouselItemProps> = (props) =>
    DOM.div(
        {
            className: classNames("widget-carousel-item", props.status),
            onClick: props.onClick,
            ref: (node: HTMLElement) => { if (props.getItemNode) { props.getItemNode(node); } },
            style: { transform: `translate3d(${props.position}%, 0px, 0px)` }
        },
        DOM.img({ alt: "Carousel image", src: props.url })
    );

CarouselItem.defaultProps = {
    position: 0
};

CarouselItem.displayName = "CarouselItem";