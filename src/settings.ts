/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-01-23
 */
import SymbolSet from './symbol-set.ts'
import {appConfigDir, join} from "@tauri-apps/api/path";
import {convertFileSrc} from "@tauri-apps/api/tauri";

export default class Settings {
    public symbolSets: SymbolSet[];

    public constructor() {
        this.symbolSets = [];
    }

    public static async fetch() {
        const appConfigDirPath = await appConfigDir();
        const settingsFilePath = await join(appConfigDirPath, 'settings.json');
        const settingsFileUrl = convertFileSrc(settingsFilePath);

        return await fetch(settingsFileUrl, {mode: 'cors'})
            .then(result => result.json())
            .then((settings: Settings) => {
                return settings;
            })
    }
}
