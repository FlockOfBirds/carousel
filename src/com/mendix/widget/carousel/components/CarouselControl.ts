import * as classNames from "classnames";
import { DOM, MouseEventHandler } from "react";

export interface CarouselControlProps {
    direction: "right" | "left";
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export const CarouselControl = (props: CarouselControlProps) =>
    DOM.div({ className: classNames("carousel-control", props.direction), onClick: props.onClick },
        DOM.span({ className: classNames("glyphicon", "glyphicon-chevron-" + props.direction) })
    );