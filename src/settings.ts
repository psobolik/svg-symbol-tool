/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-01-23
 */
import SymbolSet from './symbol-set.ts'
import {BaseDirectory, readTextFile} from '@tauri-apps/api/fs';

export default class Settings {
    public symbolSets: SymbolSet[];

    public constructor() {
        this.symbolSets = [];
    }

    public static async fetch() {
        // Read and parse contents of `$APPCONFIG/settings.json`
        const contents = await readTextFile('settings.json', { dir: BaseDirectory.AppConfig });
        return JSON.parse(contents);
    }
}
