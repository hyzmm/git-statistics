# Git Statistics

Collect commits from Git repository and present statistics in a comfortable way.

## Features

- Commits statistics for each user, including the following dimensions of information.
  1. The number of commits
  2. The number of files changed
  3. The number of insertions
  4. The number of deletions
  5. The number of lines changed
  
  The statistical results will exclude merges and will not include modifications that have been marked as renames or moves. You can specify a `PATHSPEC` to perform more precise matching on top of this.

## Installation

Clone the repository:

```shell
git clone https://github.com/hyzmm/git-statistics
cd git-statistics
```

Install CLI:

```shell
cargo install --path .
```

If you want to install the app, you can run the following command to build it:

```shell
cd app/
npm i
npm run build
cargo tauri build
```

On macOS, the generated installation package is located in *target/release/bundle/dmg*.

## CLI Usage

Type `git stats -h` to see the full help message:

```shell
git stats -h
This tool provides comprehensive statistics for each user in the current repository.

Usage: git-stats [OPTIONS] [-- <PATHSPEC>...]

Arguments:
  [PATHSPEC]...  A glob pattern to match against file paths. src, *.rs, or src/**/*.rs etc

Options:
  -s, --sort <SORT>            Sort by the specified column. The default is unordered [possible values: commits, files-changed, insertions, deletions, lines-changed]
  -c, --max-count <MAX_COUNT>  Limit the number of ros to show
  -h, --help                   Print help (see more with '--help')
  -V, --version                Print version
```

Here is an example of statistics in the [bevy](https://github.com/bevyengine/bevy) repository, go to the repository directory and run it:

```shell
$ git stats -c 5 -s commits
██████████████████████████████████████████████████████████████████████ 2820/2820
┌──────────────┬─────────┬─────────┬──────────────┬──────────────┬─────────────┐
│ Author       ┆ Commits ┆ Files   ┆ Insertions   ┆ Deletions    ┆ Lines       │
│              ┆         ┆ Changed ┆              ┆              ┆ Changed     │
╞══════════════╪═════════╪═════════╪══════════════╪══════════════╪═════════════╡
│ Carter       ┆ 1059    ┆ 16247   ┆ 723427       ┆ 682678       ┆ 1406105     │
│ Anderson     ┆ (72%)   ┆ (89%)   ┆ (94%)        ┆ (98%)        ┆ (96%)       │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ François     ┆ 214     ┆ 995     ┆ 17871        ┆ 7333         ┆ 25204       │
│              ┆ (15%)   ┆ (5%)    ┆ (2%)         ┆ (1%)         ┆ (2%)        │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ Robert Swain ┆ 76      ┆ 421     ┆ 18941        ┆ 3401         ┆ 22342       │
│              ┆ (5%)    ┆ (2%)    ┆ (2%)         ┆ (0%)         ┆ (2%)        │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ Jakob        ┆ 62      ┆ 250     ┆ 4825         ┆ 1516         ┆ 6341        │
│ Hellermann   ┆ (4%)    ┆ (1%)    ┆ (1%)         ┆ (0%)         ┆ (0%)        │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ Daniel McNab ┆ 57      ┆ 248     ┆ 2508         ┆ 2711         ┆ 5219        │
│              ┆ (4%)    ┆ (1%)    ┆ (0%)         ┆ (0%)         ┆ (0%)        │
└──────────────┴─────────┴─────────┴──────────────┴──────────────┴─────────────┘
```

This means printing the top 5 authors with the highest number of commits.

The CLI has the following arguments:

| Argument    | Description                                                                                                                                                                                                      |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sort`      | The sorting method for users, which is unordered by default. It can be sorted by 5 dimensions: commits, files-changed, insertions, deletions, lines-changed.                                                     |
| `max-count` | Limit the number of ros to show.                                                                                                                                                                                 |
| `PATHSPEC`  | A glob pattern to match against file paths. src, *.rs, or src/**/*.rs etc. <br />Prefix with `:!` to exclude the specified files, for example: `git stats -- :!src/assets` to exclude all files in `src/assets`. |

### Match specified paths

Here is an example that only counts all files in the **src** directory, and *rs* files in the **crates** directory.

```shell
git stats -s commits -c 5 -- src crates/**/*.rs
```

### Exclude specified paths

```shell
git stats -s commits -c 5 -- src crates ':!crates/bevy_core'
```

The format of the exclusion path is the same as that of the matching path, but paths prefixed with `:!` will be excluded from the statistical results.

## Application

Here are some screenshots of the app:

![screenshots](https://github.com/hyzmm/git-statistics/assets/48704743/99521b73-2bf7-404a-a5fd-6d62663b9dc2)

## TODO

- To optimize the speed of commit traversal, the current speed of traversing large projects is much slower than the Git CLI. Especially on the app, it blocks the UI thead.
- More statistical methods.
- Provide more installation channels.
