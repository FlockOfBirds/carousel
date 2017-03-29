import { DOM, SFC } from "react";

export const Alert: SFC<{ message?: string }> = (props) =>
    props.message
        ? DOM.div({ className: "alert alert-danger widget-carousel-alert" }, props.message)
        : null as any;

Alert.displayName = "Alert";
