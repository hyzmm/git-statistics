#![feature(result_flattening)]
#![feature(default_free_fn)]

mod stats;

use std::error::Error;
use git2::Repository;
use crate::stats::{get_all_user_commit_stats, get_commits};

fn main() -> Result<(), Box<dyn Error>> {
    let repo = Repository::discover(".");
    if repo.is_err() {
        eprintln!("fatal: not a git repository (or any of the parent directories): .git");
        std::process::exit(128);
    }

    let repo = repo.unwrap();
    if let commits = get_commits(&repo)? {
        let commit_stat = get_all_user_commit_stats(&repo, &commits, None);
        for (author, num_commits) in commit_stat {
            println!("{}:{} {} add {} del {}", author, num_commits.commits, num_commits.files_changed, num_commits.insertions, num_commits.deletions);
        }
    }

    Ok(())
}
