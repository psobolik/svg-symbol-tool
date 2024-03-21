// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn version() -> String {
    format!("{}", env!("CARGO_PKG_VERSION"))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![version])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
