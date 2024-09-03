/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-01-23
 */
import SymbolSet from './symbol-set.ts'
import {readTextFile, BaseDirectory} from '@tauri-apps/api/fs';

export default class Settings {
    public symbolSets: SymbolSet[];

    public constructor() {
        this.symbolSets = [];
    }

    public static async fetch() {
        // Read the text file in the `$APPCONFIG/settings.json` path
        const contents = await readTextFile('settings.json', { dir: BaseDirectory.AppConfig });
        const settings = JSON.parse(contents);
        console.log(settings);
        return settings;
    }
}
