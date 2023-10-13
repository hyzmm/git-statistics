use std::path::Path;
use std::process::Command;

use itertools::Itertools;
use serde::Serialize;

#[derive(Serialize)]
pub struct FilesChanged {
    pub insertions: usize,
    pub deletions: usize,
    pub filename: String,
}

#[derive(Serialize)]
pub struct Commit {
    pub author: String,
    pub files_changed_list: Vec<FilesChanged>,
    pub insertions: usize,
    pub deletions: usize,
    pub files_changed: usize,
}

pub fn get_commits<P: AsRef<Path>>(
    repo: P,
    pathspec: Option<&Vec<String>>,
) -> Result<Vec<Commit>, String>
{
    let mut cmd = Command::new("git");

    cmd.current_dir(repo)
        .arg("log")
        .arg("--no-merges")
        .arg("--format=author %aN")
        .arg("--numstat")
        .arg("--")
    ;
    if let Some(pathspec) = pathspec {
        cmd.args(pathspec);
    }

    // println!("cmd: {:?}", cmd);
    let output = cmd.output().expect("failed to execute process");

    if !output.status.success() {
        return Err(String::from_utf8(output.stderr).unwrap());
    }

    Ok(parse_git_log(&String::from_utf8(output.stdout).unwrap()))
}

fn parse_git_log(log: &String) -> Vec<Commit> {
    let mut commits = vec![];

    for line in log.lines() {
        if line.is_empty() { continue; }

        if line.starts_with("author ") {
            let author = line.trim_start_matches("author ");
            commits.push(Commit {
                author: String::from(author),
                insertions: 0,
                deletions: 0,
                files_changed: 0,
                files_changed_list: vec![],
            });
        } else {
            let commit = commits.last_mut().unwrap();
            let (insertions, deletions, file) = line.splitn(3, '\t').collect_tuple().unwrap();
            let insertions = insertions.parse::<usize>().unwrap_or(0);
            let deletions = deletions.parse::<usize>().unwrap_or(0);
            commit.insertions += insertions;
            commit.deletions += deletions;
            commit.files_changed += 1;
            commit.files_changed_list.push(FilesChanged {
                insertions,
                deletions,
                filename: String::from(file),
            });
        }
    }

    commits
}
