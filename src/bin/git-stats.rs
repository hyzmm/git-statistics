#![feature(slice_group_by)]

use std::collections::HashMap;
use std::error::Error;
use std::process::exit;

use clap::{Parser, ValueEnum};
use comfy_table::presets::UTF8_FULL;
use comfy_table::{Attribute, Cell, ContentArrangement, Table};
use itertools::Itertools;

use git_statistics::stats::{get_commits, Commit};

/// This tool provides comprehensive statistics for each user in the current repository.
///
/// It calculates metrics such as:
///
/// - The number of commits made by each user.
/// - The number of files changed by each user.
/// - The number of insertions by each user.
/// - The number of deletions by each user.
///
/// The count statistics exclude merged branches, as well as moved and renamed files. You can also input a matching pattern to count specific files.
#[derive(Parser, Debug)]
#[command(name = "git-stats")]
#[command(bin_name = "git-stats")]
#[command(version = "1.0")]
#[command(verbatim_doc_comment)]
struct Cli {
    /// A glob pattern to match against file paths. src, *.rs, or src/**/*.rs etc.
    ///
    /// Start with `:!` to exclude the specified files, for example: `git stats -- :!src/assets/*`
    /// to exclude all files under `src/assets`.
    #[arg(last = true)]
    pathspec: Option<Vec<String>>,
    /// Sort by the specified column. The default is commits.
    #[arg(short, long, value_enum, default_value_t = SortBy::Commits)]
    sort: SortBy,
    /// Limit the number of ros to show.
    #[arg(short = 'c', long)]
    max_count: Option<usize>,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, PartialOrd, Ord, ValueEnum)]
enum SortBy {
    Commits,
    FilesChanged,
    Insertions,
    Deletions,
    LinesChanged,
}

fn main() {
    let cli: Cli = Cli::parse();
    print_stats_table(cli.pathspec.as_ref(), cli.sort, cli.max_count).unwrap();
}

struct UserCommitStats {
    commits: usize,
    files_changed: usize,
    insertions: usize,
    deletions: usize,
    lines_changed: usize,
}

impl Default for UserCommitStats {
    fn default() -> Self {
        UserCommitStats {
            commits: 0,
            files_changed: 0,
            insertions: 0,
            deletions: 0,
            lines_changed: 0,
        }
    }
}

fn print_stats_table(
    patchspec: Option<&Vec<String>>,
    sort_by: SortBy,
    max_count: Option<usize>,
) -> Result<(), Box<dyn Error>> {
    let mut table = Table::new();
    table
        .load_preset(UTF8_FULL)
        .set_content_arrangement(ContentArrangement::Dynamic)
        .set_header(
            vec![
                "Author",
                "Commits",
                "Files Changed",
                "Insertions",
                "Deletions",
                "Lines Changed",
            ]
            .into_iter()
            .map(|x| Cell::new(x).add_attribute(Attribute::Bold))
            .collect::<Vec<Cell>>(),
        );

    let commits = get_commits(".", patchspec);
    if let Err(e) = commits {
        eprintln!("{}", e);
        exit(1);
    }
    let commits = commits.unwrap();

    let mut commit_stat = group_commits(&commits).into_iter().collect_vec();

    commit_stat.sort_by_key(|(_, commit)| match sort_by {
        SortBy::Commits => commit.commits,
        SortBy::FilesChanged => commit.files_changed,
        SortBy::Insertions => commit.insertions,
        SortBy::Deletions => commit.deletions,
        SortBy::LinesChanged => commit.insertions + commit.deletions,
    });
    commit_stat.reverse();

    if let Some(max_count) = max_count {
        commit_stat.truncate(max_count);
    }

    let sum = commit_stat
        .iter()
        .map(|e| &e.1)
        .fold(UserCommitStats::default(), |acc, stats| UserCommitStats {
            commits: acc.commits + stats.commits,
            files_changed: acc.files_changed + stats.files_changed,
            insertions: acc.insertions + stats.insertions,
            deletions: acc.deletions + stats.deletions,
            lines_changed: acc.lines_changed + stats.insertions + stats.deletions,
        });

    let cell_format = |x: usize, total: usize| {
        let left_width = if total == 0 {
            1
        } else {
            (total as i32).ilog10() as usize + 1
        };
        const RIGHT_WIDTH: usize = 7;
        if total == 0 {
            return format!("{:<left_width$}{:>RIGHT_WIDTH$}", 0, "(0%)");
        }
        let percent = format!("({}%)", (x as f64 / total as f64 * 100.0).round());
        format!("{:<left_width$}{:>RIGHT_WIDTH$}", x, percent)
    };

    for (author, stats) in commit_stat {
        table.add_row(vec![
            author,
            cell_format(stats.commits, sum.commits),
            cell_format(stats.files_changed, sum.files_changed),
            cell_format(stats.insertions, sum.insertions),
            cell_format(stats.deletions, sum.deletions),
            cell_format(
                stats.insertions + stats.deletions,
                sum.insertions + sum.deletions,
            ),
        ]);
    }
    println!("{table}");

    Ok(())
}

struct GroupedCommits {
    commits: usize,
    files_changed: usize,
    insertions: usize,
    deletions: usize,
    lines_changed: usize,
}

fn group_commits(commits: &Vec<Commit>) -> HashMap<String, GroupedCommits> {
    let mut result: HashMap<String, GroupedCommits> = HashMap::new();

    for commit in commits {
        let author = &commit.author;
        let insertions = commit.insertions;
        let deletions = commit.deletions;
        let files_changed = commit.files_changed;
        result
            .entry(author.clone())
            .and_modify(|stats| {
                stats.commits += 1;
                stats.insertions += insertions;
                stats.deletions += deletions;
                stats.lines_changed += insertions + deletions;
                stats.files_changed += 1;
            })
            .or_insert(GroupedCommits {
                commits: 1,
                insertions,
                deletions,
                lines_changed: insertions + deletions,
                files_changed,
            });
    }

    result
}
