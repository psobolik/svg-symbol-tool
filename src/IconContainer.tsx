import React from "react";

interface IconContainerProps {
    symbol: SVGSymbolElement,
    stroke: boolean,
    fill: boolean
    onClick: (element: HTMLElement) => void
}
const IconContainer: React.FunctionComponent<IconContainerProps> = (props: IconContainerProps) => {
    const svgNamespaceUri = 'http://www.w3.org/2000/svg';
    const svgElement = (symbol: SVGSymbolElement): SVGSVGElement => {
        const svgElement = document.createElementNS(svgNamespaceUri, 'svg');
        svgElement.dataset.symbolId = symbol.id;
        const viewBox = symbol.getAttribute("viewBox");
        if (viewBox) svgElement.setAttribute("viewBox", viewBox);

        const symbolClone = symbol?.cloneNode(true)!;
        svgElement.append(...symbolClone.childNodes);
        return svgElement;
    }
    const className = () => {
        let className = ["icon-container"];
        className.push(props.stroke ? "stroke" : "no-stroke");
        className.push(props.fill ? "fill" : "no-fill");
        return className.join(" ");
    }
    const symbolId = props.symbol.id?.toString();
    return <div
        onClick={e => props.onClick(e.target as HTMLElement)}
        className={className()}
        data-symbol-id={symbolId}>
            <div className="svg-container"
                dangerouslySetInnerHTML={{ __html:svgElement(props.symbol).outerHTML }}>
            </div>
            <label htmlFor={symbolId}>{symbolId}</label>
        </div>
}
export default IconContainer;