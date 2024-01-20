# SVG Symbol Subset Tool (svg-symbol-tool)
Copyright (c) 2024 Paul Sobolik

----
Use this Tauri app to select subsets of SVG symbols from Bootstrap and/or Font Awesome sets and save them into a separate file. 

The app displays only one of the installed SVG symbol sets at a time. You can change the current symbol set with the drop down. You click a symbol to add it to the selected list and click a symbol in the selected list to remove it. You can select symbols from different sets. You can enter text into the filter text box to filter the list of symbols by their name.

## Tauri Notes
<dl>
<dt><b>yarn tauri dev</b></dt><dd>Runs <b>yarn dev</b> to run the front end with Vite, builds the Tauri executable (in target/debug), and then runs it.</dd>
<dt><b>yarn tauri build</b></dt><dd>Runs <b>tsc</b> to compile the TypeScript,  <b>yarn build</b> to build the front end with Vite, and builds the Tauri executable (in target/release), including installers for it.
On Windows, the executable is <code>.\src-tauri\target\release\svg-symbol-tool.exe</code>, and the installers go in <code>.\src-tauri\target\release\bundle</code>.</dd>
</dl>