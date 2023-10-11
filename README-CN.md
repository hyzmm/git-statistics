# Git Statistics

从 Git 仓库中收集提交信息并以友好的方式呈现统计数据。

## 特性

- 为每个用户统计提交信息，包括以下维度：

    1. 提交数量
    2. 文件修改数据量
    3. 新增代码行数
    4. 删除代码行数
    5. 修改的代码行数（新增代码行数 + 删除代码行数）

  统计结果会排除合并提交，并且不包含被标记为 rename 和 move 的修改。你可以在此之上指定 `PATHSPEC` 以执行更精确的匹配。

## 安装

克隆仓库：

```shell
git clone https://github.com/hyzmm/git-statistics
cd git-statistics
```

安装 CLI:

```shell
cargo install --path .
```

如果你想要体验 UI 版应用程序时，可以运行以下命令：

```shell
cargo tauri dev
```

或者制作应用程序安装包，运行以下命令构建它：

```shell
cd app/
npm i
npm run build
cargo tauri build
```

在 macOS 上，生成的安装包位于 *target/release/bundle/dmg*。

## CLI Usage

输入 `git stats -h` 查看完整的帮助信息：

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

这是一个统计  [bevy](https://github.com/bevyengine/bevy) 仓库的例子，进入仓库目录并运行：

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

这表示打印按照提交次数排名前 5 的作者。

CLI 有下列参数：

| 参数          | 描述                                                                                                                                       |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `sort`      | 用户的排序方式，默认是无序的。有这 5 种排序方式: commits, files-changed, insertions, deletions, lines-changed。                                                 |
| `max-count` | 限制打印的行数。                                                                                                                                 |
| `PATHSPEC`  | glob 模式的匹配路径. 例如 `src`, `*.rs`, 或者 `src/**/*.rs`。 <br /> 以 `:!` 为前缀可以排除指定路径，例如： `git stats -- ':!src/assets'`  可以排除 `src/assets` 下的所有文件。 |

### 匹配指定路径

这个例子展示了如何只统计 **src** 目录下的所有路径，以及 **crates** 目录下的 *rs* 文件。

```shell
git stats -s commits -c 5 -- src crates/**/*.rs
```

### 排除指定路径

```shell
git stats -s commits -c 5 -- src crates ':!crates/bevy_core'
```

排除路径的格式和匹配路径一样，只是多了以 `:!` 为前缀。

## 应用程序

这是一些应用程序的截图：

![screenshots](https://github.com/hyzmm/git-statistics/assets/48704743/99521b73-2bf7-404a-a5fd-6d62663b9dc2)

## 待办

- 优化提交遍历速度，现在遍历大项目的速度比 Git CLI 慢很多。
- 更多的统计方法。
- 提供更多的安装渠道。
