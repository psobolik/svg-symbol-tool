/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-01-21
 */

import {writeTextFile} from "@tauri-apps/api/fs";
import {appDataDir, join} from "@tauri-apps/api/path";
import {convertFileSrc} from "@tauri-apps/api/tauri";

export default class SvgHelper {
    static async fetchSvgDocument(fileName: string): Promise<Document> {
        const appDataDirPath = await appDataDir();
        const appDataFilePath = await join(appDataDirPath, fileName);
        const dataFileUrl = convertFileSrc(appDataFilePath);

        return await fetch(dataFileUrl, { mode: 'cors' })
            .then(result => result.text())
            .then(text => {
                const domParser = new DOMParser();
                return domParser.parseFromString(text, "image/svg+xml");
            })
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
