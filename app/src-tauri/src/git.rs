use git_statistics::stats::{Commit, get_commits};

#[tauri::command]
pub async fn git_stats(repo: String, pathspec: Option<Vec<String>>) -> Result<Vec<Commit>, String> {
    get_commits(&repo, pathspec.as_ref())
}
