import React from "react";
import IconContainer from "./IconContainer.tsx";

interface IconListProps {
    container_id: string;
    items: SVGSymbolElement[];
    stroke: boolean;
    fill: boolean;
    selectSymbol: (symbolId: string) => void;
}
const IconList: React.FunctionComponent<IconListProps> = (props: IconListProps) => {
    return <div id={props.container_id}>
        {props.items.map((symbol, key) =>
            <IconContainer
                key={key}
                selectSymbol={props.selectSymbol}
                stroke={props.stroke}
                fill={props.fill}
                symbol={symbol}/>)
        }
    </div>
}
export default IconList;