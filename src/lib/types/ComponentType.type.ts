import ComponentElement from "./ComponentElement.type";
import ComponentProp from "./ComponentProp.type";
import ComponentRef from "./ComponentRef.type";

export const Refs = Symbol.for('refs')
export const Props = Symbol.for('props')
export const Elements = Symbol.for('elements')

export interface ComponentType {
    [Refs]: Record<string, ComponentRef<any>>
    [Props]: Record<string, ComponentProp>
    [Elements]: Record<string, ComponentElement>
}