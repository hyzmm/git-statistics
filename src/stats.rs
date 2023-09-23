use std::collections::HashMap;
use git2::{Commit, Diff, DiffOptions, Error, Repository};

pub fn get_commits(repo: &Repository) -> Result<Vec<Commit>, git2::Error> {
    let mut revwalk = repo.revwalk()?;
    revwalk.set_sorting(git2::Sort::TIME)?;
    revwalk.push_head()?;
    Ok(revwalk.into_iter().filter_map(|oid| {
        if let Ok(oid) = oid {
            return repo.find_commit(oid).ok().and_then(|commit| {
                if commit.parent_count() > 1 {
                    None
                } else {
                    Some(commit)
                }
            });
        } else {
            None
        }
    }).collect())
}

fn get_diff<'a>(repo: &'a Repository, commit: &Commit, pathspec: Option<&Vec<String>>) -> Result<Diff<'a>, Error> {
    let parent = commit.parent(0);
    let (parent, child) = (parent.ok().map(|e| e.tree().ok()).flatten(), commit.tree().ok());
    let mut opts = DiffOptions::new();
    if let Some(pathspec) = pathspec {
        for pattern in pathspec {
            opts.pathspec(pattern);
        }
    }
    repo.diff_tree_to_tree(parent.as_ref(), child.as_ref(), Some(&mut opts))
}

pub struct UserCommitStats {
    pub commits: usize,
    pub files_changed: usize,
    pub insertions: usize,
    pub deletions: usize,
    pub author: String,
}

impl Default for UserCommitStats {
    fn default() -> Self {
        Self {
            commits: 0,
            files_changed: 0,
            insertions: 0,
            deletions: 0,
            author: String::default(),
        }
    }
}

fn author_unique_key(author: &git2::Signature) -> String {
    String::from(author.name().or_else(|| author.email()).unwrap_or("unknown"))
}


pub fn get_all_user_commit_stats(repo: &Repository, commits: &Vec<Commit>, pathspec: Option<&Vec<String>>) -> Vec<(String, UserCommitStats)> {
    let mut result: HashMap<String, UserCommitStats> = HashMap::new();

    for commit in commits {
        let author = commit.author();
        let entry = result.entry(author_unique_key(&author)).or_default();
        entry.commits += 1;

        if let Ok(stats) = get_diff(repo, commit, pathspec).map(|mut diff| {
            // Exclusion of renamed and copied files from statistics
            let _ = diff.find_similar(None);
            diff.stats()
        }).flatten() {
            entry.files_changed += stats.files_changed();
            entry.insertions += stats.insertions();
            entry.deletions += stats.deletions();
        }
    }
    result.into_iter().collect()
}