import React from "react";
import IconContainer from "./IconContainer.tsx";

interface IconListProps {
    container_id: string,
    items: SVGSymbolElement[],
    stroke: boolean,
    fill: boolean
    onItemClick: (element: HTMLElement) => void
}
const IconList: React.FunctionComponent<IconListProps> = (props: IconListProps) => {
    return <div id={props.container_id}>
        {props.items.map(symbol =>
            <IconContainer
                onClick={props.onItemClick}
                stroke={props.stroke}
                fill={props.fill}
                key={symbol.id}
                symbol={symbol}/>)
        }
    </div>
}
export default IconList;