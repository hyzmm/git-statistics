use anyhow::bail;
use git_statistics::Repository;
use git_statistics::stats::{get_all_user_commits_stats, get_commits, UserCommitStats};

#[tauri::command]
pub async fn git_stats(repo: String, pathspec: Option<Vec<String>>, exclusive: Option<Vec<String>>) -> Result<Vec<(String, UserCommitStats)>, String> {
    let repo = Repository::discover(repo);
    if let Ok(repo) = repo {
        if let Ok(commits) = get_commits(&repo) {
            Ok(get_all_user_commits_stats(&repo, &commits, pathspec.as_ref(), exclusive.as_ref(), || {}))
        } else {
            Err("no commits found".to_string())
        }
    } else {
        Err("fatal: not a git repository (or any of the parent directories): .git".to_string())
    }
}
