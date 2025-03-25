/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-01-23
 */
import SymbolSet from './symbol-set.ts'
import {readTextFile} from '@tauri-apps/plugin-fs';
import {appConfigDir, resolve} from "@tauri-apps/api/path";

export default class Settings {
    static fileName = "settings.json";
    
    public symbolSets: SymbolSet[] = [];

    public static async fetch(): Promise<Settings> {
        // Read and parse contents of `$APPCONFIG/settings.json`
        const dir = await appConfigDir();
        const settingsFile = await resolve(dir, Settings.fileName);
        const contents = await readTextFile(settingsFile);
        return JSON.parse(contents);
    }
}
