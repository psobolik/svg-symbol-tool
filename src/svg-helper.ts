/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-01-21
 */

import {BaseDirectory, readTextFile, writeTextFile} from "@tauri-apps/api/fs";

export default class SvgHelper {
    static async fetchSvgDocument(fileName: string): Promise<Document> {
        const contents = await readTextFile(fileName, { dir: BaseDirectory.AppData });
        const domParser = new DOMParser();
        return domParser.parseFromString(contents, "image/svg+xml");
    }

    static async writeSvgElement(filePath: string, svgElement: SVGElement) {
        const xmlDocument = document.implementation.createDocument("", "", null);
        xmlDocument.insertBefore(xmlDocument.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8" standalone="no"'), xmlDocument.firstChild);

        xmlDocument.appendChild(svgElement.cloneNode(true));
        const xmlSerializer = new XMLSerializer();
        const svgString = xmlSerializer.serializeToString(xmlDocument);

        await writeTextFile(filePath, svgString);
    }
}
