import './css/main.css'

import SvgHelper from "./svg-helper.ts";
import {save} from "@tauri-apps/api/dialog";
import {downloadDir} from "@tauri-apps/api/path";
import Settings from "./settings.ts";

const svgNamespaceUri = 'http://www.w3.org/2000/svg';

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('container')!.style.visibility = 'visible';
    getNotifyContainer().style.visibility = 'visible';

    const notifyContainer = getNotifyContainer();
    notifyContainer.addEventListener('animationend', _evt => {
        notifyContainer.classList.remove('notify-animate');
    });
    document.getElementById('save-button')!.addEventListener('click', handleSave);
    const filterEl = getFilterInput();
    filterEl.value = '';
    filterEl.addEventListener('keyup', handleFilterInput);
    document.addEventListener('keypress', (event => {
        if (document.activeElement != filterEl) {
            event.preventDefault();
            filterEl.focus();
            filterEl.value += event.key
        }
    }))
    document.addEventListener('keyup', (event => {
        if (document.activeElement != filterEl && event.code == "Escape") {
            const e = new KeyboardEvent('keyup', {code: event.code, key: event.key, altKey: event.altKey});
            filterEl.dispatchEvent(e);
        }
    }))
    getStrokeCheckbox().addEventListener('change', updateStrokeAndFill);
    getFillCheckbox().addEventListener('change', updateStrokeAndFill);

    setSelectContainerVisibility();
    setupFileSelect();
})

function setupFileSelect() {
    const select = document.getElementById('file-select') as HTMLSelectElement;
    select.addEventListener('change', event => {
        loadSymbols(event.target as HTMLSelectElement);
    })
    Settings.fetch().then(config => {
        config.symbolSets.forEach(symbolSet => {
            const option = select.appendChild(new Option(symbolSet.display, symbolSet.file));
            if (symbolSet.stroke) option.dataset.stroke = '';
            if (symbolSet.fill) option.dataset.fill = '';
        });
        loadSymbols(select);
    });
}

function loadSymbols(selectElement: HTMLSelectElement) {
    const option = selectElement.options[selectElement.selectedIndex];
    const symbolContainer = getSymbolContainer();
    while (symbolContainer.hasChildNodes())
        symbolContainer.removeChild(symbolContainer.lastElementChild as Element);

    SvgHelper.fetchSvgDocument(option.value)
        .then(async svgDoc => {
            [...svgDoc.querySelectorAll('symbol')]
                .sort((lhs, rhs) => {
                    return lhs.id.localeCompare(rhs.id);
                })
                .forEach(symbol =>
                    symbolContainer.appendChild(createIconContainer(symbol))
                        .addEventListener('click', evt => {
                            selectSymbol(evt.target as HTMLElement);
                        })
                )
            getStrokeCheckbox().checked = option.dataset.stroke != undefined;
            getFillCheckbox().checked = option.dataset.fill != undefined;
            updateStrokeAndFill();
            applyFilter();
        })
}

function createIconContainer(symbol: SVGSymbolElement) {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');
    iconContainer.dataset['symbolId'] = symbol.id;

    const svgContainer = iconContainer.appendChild(document.createElement('div'));
    svgContainer.classList.add('svg-container');

    const svgElement = svgContainer.appendChild(document.createElementNS(svgNamespaceUri, 'svg'));
    copyAttribute('viewBox', symbol, svgElement);

    const symbolClone = symbol?.cloneNode(true)!;
    svgElement.append(...symbolClone.childNodes);

    const label = iconContainer.appendChild(document.createElement('label'));
    label.setAttribute('for', symbol.id);
    label.innerText = symbol.id;

    return iconContainer;
}

function selectSymbol(element: HTMLElement) {
    const iconContainer = findIconContainer(element)!;
    const symbolId = (iconContainer as HTMLElement).dataset['symbolId']!;

    const selected = getSelectedSymbolIds();
    if (!selected.includes(symbolId)) {
        const container = getSelectIconContainer();
        element = container.appendChild(iconContainer.cloneNode(true)) as HTMLElement;
        element.addEventListener('click', evt => {
            unselectSymbol(evt.target as HTMLElement)
        })
    }
    setSelectContainerVisibility();
}

function unselectSymbol(el: HTMLElement) {
    const iconContainer = findIconContainer(el);
    if (iconContainer == null) return;

    const container = getSelectIconContainer();
    container.removeChild(iconContainer);
    setSelectContainerVisibility();
}

function handleFilterInput(event: KeyboardEvent) {
    if (event.code == "Escape")
        getFilterInput().value = '';
    applyFilter();
}

function applyFilter() {
    const input = getFilterInput();
    const re = new RegExp(`^.*${input.value}.*$`);
    const symbolContainer = getSymbolContainer();
    [...symbolContainer.children].map(child => {
        const element = child as HTMLElement;
        element.style.display = re.test(element.dataset['symbolId']!) ? '' : 'none';
    })
}

function handleSave() {
    const svgElement = getSelected();
    if (svgElement == null) return;

    getSavePath()
        .then(savePath => {
            if (savePath == null) return;
            SvgHelper.writeSvgElement(savePath, svgElement)
                .then(() => {
                    getNotifyContainer().classList.add('notify-animate');
                })
        })
}

async function getSavePath() {
    const suggestedFilename = "svg-subset.svg";
    return await save({
        defaultPath: `${await downloadDir()}/${suggestedFilename}`,
        filters: [{
            extensions: ['svg'],
            name: 'SVG Files',
        }]
    });
}

function getSelected(): SVGSVGElement | null {
    const selectIconContainer = getSelectIconContainer();
    if (selectIconContainer.childNodes.length <= 0) return null;

    const svgElement = document.createElementNS(svgNamespaceUri, 'svg');
    svgElement.setAttribute('viewBox', `0 0 16 16`); // This is arbitrary.

    selectIconContainer.childNodes.forEach(childNode => {
        const iconContainer = childNode as HTMLDivElement;
        const id = iconContainer.dataset['symbolId']!;
        const svg = iconContainer.firstChild?.firstChild!.cloneNode(true)!;

        const symbolElement = svgElement.appendChild(document.createElementNS(svgNamespaceUri, 'symbol'));
        symbolElement.setAttribute('id', id);
        copyAttributes(svg as Element, symbolElement);
        symbolElement.append(...svg.childNodes)
    })
    return svgElement;
}

function getSelectedSymbolIds() {
    const container = getSelectIconContainer();
    return [...container.children].map(child => (child as HTMLElement).dataset['symbolId']);
}

function setSelectContainerVisibility() {
    const container = (document.getElementById('select-container') as HTMLElement);
    if (getSelectedSymbolIds().length) {
        container.style.visibility = 'visible';
        container.style.height = 'auto';
    } else {
        container.style.visibility = 'hidden';
        container.style.height = '0';
    }
}

function getNotifyContainer() {
    return document.getElementById('notify-container') as HTMLDivElement
}

function getFilterInput() {
    return document.getElementById('filter-input') as HTMLInputElement
}

function getStrokeCheckbox() {
    return document.getElementById('stroke') as HTMLInputElement
}

function getFillCheckbox() {
    return document.getElementById('fill') as HTMLInputElement
}

function getSymbolContainer() {
    return document.getElementById('symbol-container') as HTMLDivElement
}

function getSelectIconContainer() {
    return document.getElementById('select-icon-container') as HTMLDivElement
}

function updateStrokeAndFill() {
    const stroke = getStrokeCheckbox().checked;
    const fill = getFillCheckbox().checked;
    const svgContainers = document.getElementsByClassName('svg-container');
    [...svgContainers].forEach(svgContainer => {
        if (stroke) {
            svgContainer.classList.remove('no-stroke');
            svgContainer.classList.add('stroke');
        } else {
            svgContainer.classList.remove('stroke');
            svgContainer.classList.add('no-stroke');
        }
        if (fill) {
            svgContainer.classList.remove('no-fill');
            svgContainer.classList.add('fill');
        } else {
            svgContainer.classList.remove('fill');
            svgContainer.classList.add('no-fill');
        }
    })
}

function findIconContainer(el: HTMLElement): Element | null {
    return el?.closest('.icon-container');
}

function copyAttribute(name: string, from: Element, to: Element) {
    const value = from.getAttribute(name);
    if (value)
        to.setAttribute(name, value);
}

function copyAttributes(from: Element, to: Element) {
    [...from.attributes].forEach(attribute => {
        to.setAttribute(attribute.name, attribute.value);
    });
}
