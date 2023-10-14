use std::process::Command;

use git_statistics::stats::{Commit, get_commits};

#[tauri::command]
pub async fn git_stats(repo: String, pathspec: Option<Vec<String>>) -> Result<Vec<Commit>, String> {
    get_commits(&repo, pathspec.as_ref())
}

#[tauri::command]
pub async fn git_total_files(repo: String, pathspec: Option<Vec<String>>) -> Result<usize, String> {
    let mut command = Command::new("git");
    command.current_dir(repo)
        .arg("ls-files")
        .arg("--");
    command.args(pathspec.unwrap_or_default());
    println!("{:?}", command);

    command.output().map(|e| {
        e.stdout.iter().filter(|e| e == &&b'\n').count()
    }).map_err(|e| e.to_string())
}