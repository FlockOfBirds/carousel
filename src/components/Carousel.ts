import { Component, DOM, MouseEventHandler, createElement } from "react";
import * as classNames from "classnames";

import { Alert } from "./Alert";
import { CarouselControl } from "./CarouselControl";
import { CarouselItem, ItemStatus } from "./CarouselItem";

import "../ui/Carousel.css";

interface Image {
    guid?: string;
    url: string;
    onClickMicroflow?: string;
    onClickForm?: string;
}

interface CarouselProps {
    alertMessage?: string;
    images: Image[];
    onClickAction?: (image: Image) => void;
}

interface CarouselState {
    activeIndex: number;
    alertMessage?: string;
    showControls?: boolean;
    position?: number;
    animate?: boolean;
}

interface CustomEvent extends Event {
    detail: {
        originPageX: number;
        originPageY: number;
        pageX: number;
        pageY: number;
    };
    target: HTMLElement;
}

type Direction = "right" | "left";

class Carousel extends Component<CarouselProps, CarouselState> {
    static defaultProps: CarouselProps = {
        images: []
    };
    private moveToTheLeft: MouseEventHandler<HTMLDivElement>;
    private moveToTheRight: MouseEventHandler<HTMLDivElement>;
    private handleSwipeRightEnd: (event: Event) => void;
    private handleSwipeLeftEnd: (event: Event) => void;
    private carouselWidth: number;
    private carouselItems: HTMLElement[];

    constructor(props: CarouselProps) {
        super(props);

        this.carouselWidth = 0;
        this.carouselItems = [];
        this.moveToTheLeft = () => this.moveInDirection("left");
        this.moveToTheRight = () => this.moveInDirection("right");
        this.handleSwipe = this.handleSwipe.bind(this);
        this.handleSwipeLeftEnd = (event: CustomEvent) => this.handleSwipeEnd(event, "left");
        this.handleSwipeRightEnd = (event: CustomEvent) => this.handleSwipeEnd(event, "right");
        this.state = {
            activeIndex: 0,
            alertMessage: props.alertMessage,
            animate: false,
            position: 0,
            showControls: this.props.images.length > 1
        };
    }

    render() {
        return DOM.div({ className: "widget-carousel-wrapper" },
            createElement(Alert, { message: this.state.alertMessage }),
            DOM.div({ className: "widget-carousel" },
                DOM.div(
                    {
                        className: classNames("widget-carousel-item-wrapper", { animate: this.state.animate }),
                        style: { transform: `translate3d(${this.state.position}%, 0px, 0px)` }
                    },
                    this.createCarouselItems(this.props.images, this.state.activeIndex || 0)
                ),
                this.createCarouselControls()
            )
        );
    }

    componentWillReceiveProps(newProps: CarouselProps) {
        if (this.carouselItems.length) {
            this.removeEvents();
            this.carouselItems = [];
        }

        this.setState({ alertMessage: newProps.alertMessage, showControls: newProps.images.length > 1 });
    }

    componentWillUnmount() {
        this.removeEvents();
    }

    private createCarouselItems(images: Image[], activeIndex: number) {
        return images.map((image, index) => {
            const { position, status } = this.getItemStatus(index, activeIndex);
            return createElement(CarouselItem, {
                getItemNode: (node: HTMLElement) => this.addCarouselItem(node),
                key: index,
                onClick: () => { if (this.props.onClickAction) this.props.onClickAction(image); },
                position,
                status,
                url: image.url
            });
        });
    }

    private getItemStatus(index: number, activeIndex: number): { position: number, status: ItemStatus } {
        const maxPercentage = 100;
        return {
            position: (index - activeIndex) * maxPercentage,
            status: classNames({
                active: index === activeIndex,
                next: activeIndex < index,
                prev: activeIndex > index
            }) as ItemStatus
        };
    }

    private createCarouselControls() {
        if (!this.state.showControls) return null;

        const directions: Direction[] = this.state.activeIndex === this.props.images.length - 1
            ? [ "left" ]
            : this.state.activeIndex === 0 ? [ "right" ] : [ "right", "left" ];

        return directions.map((direction, index) =>
            createElement(CarouselControl, {
                direction,
                key: index,
                onClick: direction === "right" ? this.moveToTheRight : this.moveToTheLeft
            })
        );
    }

    private addCarouselItem(carouselItem: HTMLElement) {
        if (carouselItem && (this.carouselItems.length < this.props.images.length)) {
            this.carouselItems.push(carouselItem);
            this.registerEvents(carouselItem);
        }
    }

    private moveInDirection(direction: Direction, swiping = false) {
        const { activeIndex } = this.state;
        const newActiveIndex = direction === "right" ? activeIndex + 1 : activeIndex - 1;

        this.setState({
            activeIndex: newActiveIndex,
            alertMessage: "",
            animate: true,
            position: swiping ? this.state.position : 0
        });
    }

    private registerEvents(carouselItem: HTMLElement) {
        carouselItem.addEventListener("swipeleft", this.handleSwipe);
        carouselItem.addEventListener("swipeleftend", this.handleSwipeLeftEnd);
        carouselItem.addEventListener("swiperight", this.handleSwipe);
        carouselItem.addEventListener("swiperightend", this.handleSwipeRightEnd);
        carouselItem.addEventListener("touchmove", (event) => event.preventDefault());
    }

    private removeEvents() {
        this.carouselItems.forEach((carouselItem: HTMLElement) => {
            carouselItem.removeEventListener("swipeleft", this.handleSwipe);
            carouselItem.removeEventListener("swipeleftend", this.handleSwipeLeftEnd);
            carouselItem.removeEventListener("swiperight", this.handleSwipe);
            carouselItem.removeEventListener("swiperightend", this.handleSwipeRightEnd);
            carouselItem.removeEventListener("touchmove", (event) => event.preventDefault());
        });
    }

    private handleSwipe(event: CustomEvent) {
        const { parentElement } = event.target;
        this.carouselWidth = this.carouselWidth || (parentElement ? parentElement.offsetWidth : 0);
        const currentPercentage = this.calculateSwipePercentage(event, this.carouselWidth);
        if (!this.shouldSwipe(currentPercentage)) { return; }
        this.setState({
            activeIndex: this.state.activeIndex,
            animate: false,
            position: currentPercentage,
            showControls: false
        });
    }

    private handleSwipeEnd(event: CustomEvent, direction: Direction) {
        const swipeOutThreshold = 20;
        const currentPercentage = this.calculateSwipePercentage(event, this.carouselWidth);
        if (!this.shouldSwipe(currentPercentage)) { return; }
        this.carouselWidth = 0;
        const swipingOut = Math.abs(currentPercentage) > swipeOutThreshold;
        if (swipingOut) {
            this.moveInDirection(direction === "right" ? "left" : "right", true);
        }

        this.setState({
            activeIndex: this.state.activeIndex,
            animate: true,
            position: 0,
            showControls: !this.state.showControls && !!this.carouselItems.length
        });
    }

    private calculateSwipePercentage(event: CustomEvent, width: number): number {
        const maxPercentage = 100;
        const swipeOffset = event.detail.pageX - event.detail.originPageX;
        return maxPercentage / width * swipeOffset;
    }

    private shouldSwipe(percentage: number) {
        return percentage > 0
            ? this.state.activeIndex > 0
            : this.state.activeIndex < this.carouselItems.length - 1;
    }
}

export { Carousel, CarouselProps, Image };