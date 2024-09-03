# SVG Symbol Subset Tool (svg-symbol-tool)
Copyright (c) 2024 Paul Sobolik

----
Use this [Tauri](https://tauri.app/) app to select subsets of symbols from SVG collections, like those from [Bootstrap](https://icons.getbootstrap.com/) 
or [Font Awesome](https://fontawesome.com/), and save them into a separate file. 

You can select symbols from any of the installed SVG symbol sets, although the app displays only set at a time. 
Click a symbol from the current set to add it to the list of selected symbols; click a symbol in the selected list to remove it. 
You can enter text into the filter text box to filter the list of symbols by their name.

## Note
This app expects to find a settings file named `settings.json` in the `$APPCONFIG` folder with
details about the available SVG symbol sets. The SVG symbol set files must be in a folder in the `$APPDATA` folder. 

| System  | $APPCONFIG                                     | $APPDATA                                       |
|---------|------------------------------------------------|------------------------------------------------| 
| Windows | $HOME\AppData\Roaming\psobolik-svg-symbol-tool | $HOME\AppData\Roaming\psobolik-svg-symbol-tool |
| Linux   | ~/.config/psobolik-svg-symbol-tool             | ~/.local/share/psobolik-svg-symbol-tool        |

Because I couldn't face writing the code needed to maintain them, the settings have to be edited directly. 
I expect to be the one and only user of this app, anyway.

Here's an example `settings.json` file:
```json
{
"symbolSets":
  [
    {
        "display": "Bootstrap Icons",
        "file": "symbol-sets/bootstrap-icons.svg",
        "stroke": false,
        "fill": true
    },
    {
        "display": "Font Awesome Regular",
        "file": "symbol-sets/regular.svg",
        "stroke": false,
        "fill": true
    }
  ]
}
```


## Tauri Notes
<dl>
<dt><b>pnpm tauri dev</b></dt><dd>Runs <b>pnpm dev</b> to run the front end with Vite, 
builds the Tauri executable into target/debug, and then runs it.</dd>
<dt><b>pnpm tauri build</b></dt><dd>Runs <b>tsc</b> to compile the TypeScript, 
<b>pnpm build</b> to build the front end with Vite, and builds the Tauri executable into `target/release`.
Taure also creates installers for the app into subdirectories of `target/release/bundle`.  

On Windows, the executable is <code>.\src-tauri\target\release\svg-symbol-tool.exe</code>, and the installers go in <code>.\src-tauri\target\release\bundle</code>.</dd>
</dl>
