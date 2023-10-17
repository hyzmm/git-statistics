use std::process::Command;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
use git_statistics::stats::{Commit, get_commits};

// List of all process creation flags:
// https://learn.microsoft.com/en-us/windows/win32/procthread/process-creation-flags
const CREATE_NO_WINDOW: u32 = 0x08000000;

#[tauri::command]
pub async fn git_stats(repo: String, pathspec: Option<Vec<String>>) -> Result<Vec<Commit>, String> {
    get_commits(&repo, pathspec.as_ref())
}

#[tauri::command]
pub async fn git_total_files(repo: String, pathspec: Option<Vec<String>>) -> Result<usize, String> {
    let mut command = Command::new("git");
    #[cfg(target_os = "windows")]
    command.creation_flags(CREATE_NO_WINDOW);
    command.current_dir(repo)
        .arg("ls-files")
        .arg("--");
    command.args(pathspec.unwrap_or_default());
    println!("{:?}", command);

    command.output().map(|e| {
        e.stdout.iter().filter(|e| e == &&b'\n').count()
    }).map_err(|e| e.to_string())
}