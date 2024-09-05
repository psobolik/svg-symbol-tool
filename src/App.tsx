import './css/app.css';

import React from "react";
import Settings from "./settings.ts";
import SvgHelper from "./svg-helper.ts";
import {save} from "@tauri-apps/api/dialog";
import {downloadDir} from "@tauri-apps/api/path";
import IconList from "./IconList.tsx";
import SymbolSet from "./symbol-set.ts";
import Footer from "./Footer.tsx";
import SavedPopup from "./SavedPopup.tsx";

const App: React.FunctionComponent = () => {
    const svgNamespaceUri = 'http://www.w3.org/2000/svg';

    const [availableSymbols, setAvailableSymbols] = React.useState<SVGSymbolElement[]>([]);
    const [selectedSymbols, setSelectedSymbols] = React.useState<SVGSymbolElement[]>([]);
    const [anySelected, setAnySelected] = React.useState<boolean>(false);
    const [filter, setFilter] = React.useState<string>("");
    const [selectedSymbolSet, setSelectedSymbolSet] = React.useState<SymbolSet | undefined>();
    const [selectedSymbolSetName, setSelectedSymbolSetName] = React.useState<string>("");
    const [stroke, setStroke] = React.useState<boolean>(false);
    const [fill, setFill] = React.useState<boolean>(false);
    const [showSavedPopup, setShowSavedPopup] = React.useState<boolean>(false);

    React.useEffect(() => {
        // React runs one-time effects twice in development, to make sure you have a cleanup function;
        // This is the recommended rigmarole to work around that for async effects.
        let is_setup = false;
        const setupFileSelect = async () => {
            const config: Settings = await Settings.fetch();
            if (is_setup) return;

            const select = document.getElementById('symbol-set-list') as HTMLSelectElement;
            config.symbolSets.forEach(symbolSet => {
                const option = select.appendChild(new Option(symbolSet.display, symbolSet.file));
                option.dataset.symbolSet = JSON.stringify(symbolSet);
            });
            if (config.symbolSets.length) setSelectedSymbolSet(config.symbolSets[0]);
        }
        setupFileSelect().catch(console.error);
        return () => {
            is_setup = true;
        }
    }, []);
    React.useEffect(() => {
        applyFilter()
    }, [availableSymbols, filter])
    React.useEffect(() => {
        loadSymbolSet()
    }, [selectedSymbolSet])
    React.useEffect(() => {
        setAnySelected(selectedSymbols.length > 0)
    }, [selectedSymbols])

    const loadSymbolSet = () => {
        if (!selectedSymbolSet) return;

        SvgHelper.fetchSvgDocument(selectedSymbolSet.file)
            .then(async svgDoc => {
                const symbols = [...svgDoc.querySelectorAll('symbol')]
                    .sort((lhs, rhs) => {
                        return lhs.id.localeCompare(rhs.id);
                    })
                setAvailableSymbols(symbols);
                setStroke(selectedSymbolSet.stroke);
                setFill(selectedSymbolSet.fill);
            })
    }

    const findIconContainer = (el: HTMLElement): Element | null => {
        return el?.closest('.icon-container');
    }

    const selectSymbol = (element: HTMLElement) => {
        const iconContainer = findIconContainer(element) as HTMLElement;
        const symbolId = iconContainer.dataset.symbolId!;
        if (!selectedSymbols.find(symbol => symbol.dataset.symbolId === symbolId)) {
            let symbol = iconContainer.firstChild?.firstChild as SVGSymbolElement;
            symbol.id = symbol.dataset.symbolId!;
            setSelectedSymbols([...selectedSymbols, symbol]);
        }
    }

    const unselectSymbol = (el: HTMLElement) => {
        const iconContainer = findIconContainer(el);
        if (iconContainer == null) return;

        const symbolId = (iconContainer as HTMLElement).dataset['symbolId']!;
        const filtered = selectedSymbols.filter(symbol => symbol.id !== symbolId);
        setSelectedSymbols(filtered);
    }

    const onFilterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code == "Escape") setFilter("");
    }

    const applyFilter = () => {
        const re = new RegExp(`^.*${filter}.*$`);
        const symbolContainer = document.getElementById('symbol-container') as HTMLDivElement;
        [...symbolContainer.children].map(child => {
            const element = child as HTMLElement;
            element.style.display = re.test(element.dataset['symbolId']!) ? '' : 'none';
        })
    }

    const handleSave = () => {
        const svgElement = getSaveElement();
        if (svgElement == null) return;

        getSavePath()
            .then(savePath => {
                if (savePath == null) return;
                SvgHelper.writeSvgElement(savePath, svgElement)
                    .then(() => setShowSavedPopup(true))
            })
    }

    const getSavePath = async () => {
        const suggestedFilename = "svg-subset.svg";
        return await save({
            defaultPath: `${await downloadDir()}/${suggestedFilename}`, filters: [{
                extensions: ['svg'], name: 'SVG Files',
            }]
        });
    }

    const getSaveElement = (): SVGSVGElement | null => {
        if (!anySelected) return null;

        const svgElement = document.createElementNS(svgNamespaceUri, 'svg');
        svgElement.setAttribute('viewBox', `0 0 16 16`); // This is arbitrary.

        selectedSymbols.map(symbol => {
            const symbolElement = svgElement.appendChild(document.createElementNS(svgNamespaceUri, 'symbol'));
            symbolElement.id = symbol.dataset.symbolId!;
            symbolElement.append(...symbol.cloneNode(true).childNodes)
        })
        return svgElement;
    }

    return (<>
        <div id="container">
            <header>
                <div id="header">
                    <span className="heading">SVG Symbol Subset Tool</span>
                    <label htmlFor="filter-input">Filter:&ensp;</label>
                    <input id="filter-input" type="text" placeholder="Filter"
                           value={filter}
                           onChange={e => setFilter(e.target.value)}
                           onKeyDown={e => onFilterKey(e)}
                    />
                </div>
                <div id="controls">
                    <div>
                        <label htmlFor="symbol-set-list">Symbol Set:&ensp;</label>
                        <select id="symbol-set-list" value={selectedSymbolSetName}
                                onChange={(e) => {
                                    const select = e.target as HTMLSelectElement;
                                    const option = select.options[select.selectedIndex];
                                    const symbolSet = JSON.parse(option.dataset.symbolSet!);
                                    setSelectedSymbolSet(symbolSet);
                                    setSelectedSymbolSetName(symbolSet.name);
                                }}></select>
                    </div>
                    <div>
                        <label htmlFor="stroke">Stroke </label>
                        <input type="checkbox" id="stroke" checked={stroke}
                               onChange={e => setStroke(e.target.checked)}
                        />
                        &emsp;
                        <label htmlFor="fill">Fill </label>
                        <input type="checkbox" id="fill" checked={fill}
                               onChange={e => setFill(e.target.checked)}/>
                    </div>
                </div>
            </header>
            <section>
                <div id="select-container" className={anySelected ? "visible" : "invisible"}>
                    <div className="label-container">
                        <label htmlFor="save-button">Selected</label>
                        <button id="save-button" onClick={handleSave}>Save</button>
                    </div>
                    <IconList container_id="select-icon-container"
                              stroke={stroke}
                              fill={fill}
                              items={selectedSymbols}
                              onItemClick={unselectSymbol}
                    />
                </div>
                <IconList container_id="symbol-container"
                          stroke={stroke}
                          fill={fill}
                          items={availableSymbols}
                          onItemClick={selectSymbol}
                />
            </section>
            <Footer/>
        </div>
        <SavedPopup show={showSavedPopup} onDone={() => setShowSavedPopup(false)}/>
    </>)
}

export default App;