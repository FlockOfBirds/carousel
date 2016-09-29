
import { SIZE_MAP } from "./StyleConfig";

export interface IObject extends Object {
  [key: string]: any;
}

export interface IBootstrapProps extends IObject {
  bsClass?: string;
  bsSize?: string;
  bsStyle?: string;
  bsRole?: string;
}

/**
 * Returns a prefixed version of its parameters
 * i.e props.bsClass + "-" + variant
 *
 * @export
 * @param {IBootstrapProps} props
 * @param {string} [variant]
 * @returns
 */
export function prefix(props: IBootstrapProps, variant?: string) {
  if (props.bsClass === null) {
    throw new Error("A `bsClass` prop is required for this component");
  }
  return props.bsClass + (variant ? `-${variant}` : "");
}

export function getClassSet(props: IBootstrapProps) {
  const classes: IObject = {
    [prefix(props)]: true,
  };

  if (props.bsSize) {
    const bsSize = SIZE_MAP[props.bsSize] || props.bsSize;
    classes[prefix(props, bsSize)] = true;
  }

  if (props.bsStyle) {
    classes[prefix(props, props.bsStyle)] = true;
  }

  return classes;
}
