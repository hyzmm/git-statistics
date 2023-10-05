// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use git_statistics::stats::UserCommitStats;

mod git;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![git_stats])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn git_stats(repo: String, pathspec: Option<Vec<String>>, exclusive: Option<Vec<String>>) -> Result<Vec<(String, UserCommitStats)>, String> {
    git::git_stats(repo, pathspec, exclusive).map_err(|e| e.to_string())
}
