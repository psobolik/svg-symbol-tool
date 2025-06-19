/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-01-21
 */

import {readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {appLocalDataDir, resolve} from "@tauri-apps/api/path";

export default class SvgHelper {
    static async fetchSvgDocument(fileName: string): Promise<Document> {
        const dir = await appLocalDataDir();
        const file = await resolve(dir, fileName);
        const text = await readTextFile(file);
        const domParser = new DOMParser();
        return domParser.parseFromString(text, "image/svg+xml");
    }

    static async writeSvgDocument(filePath: string, svgDocument: XMLDocument) {
        const xmlSerializer = new XMLSerializer();
        const docString = xmlSerializer.serializeToString(svgDocument);
        await writeTextFile(filePath, docString);
    }
}
