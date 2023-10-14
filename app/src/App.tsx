import './App.css';
import Chart from './Chart.tsx';
import {useMemo} from 'react';
import {type Commit} from './types.ts';
import {openRepo, pickRepo} from './open_repo.ts';
import CountLimit from './components/CountLimit.tsx';
import {useHotkeys} from 'react-hotkeys-hook';
import {SortBy, useSettingsStore} from './SettingsState.ts';
import {useShallow} from 'zustand/react/shallow';
import Sort from './components/Sort.tsx';
import PathList from './components/PathList.tsx';

function App() {
	const {commits, ...settings} = useSettingsStore(useShallow(state => ({
		commits: state.commits,
		repo: state.repo,
		sortBy: state.sortBy,
		includedPaths: state.includedPaths,
		excludedPaths: state.excludedPaths,
		addIncludePath: state.addIncludePath,
		setIncludedPaths: state.setIncludedPaths,
		setExcludedPaths: state.setExcludedPaths,
		countLimitationEnabled: state.countLimitationEnabled,
		countLimitation: state.countLimitation,
	})));

	useHotkeys('mod+o', pickRepo);

	const groupedData = useMemo(() => {
		const grouped = new Map<string, Commit>();
		for (const item of commits) {
			const stat = grouped.get(item.author);
			if (stat) {
				stat.commits += 1;
				stat.insertions += item.insertions;
				stat.deletions += item.deletions;
				stat.files_changed += item.files_changed;
			} else {
				grouped.set(item.author, {...item, commits: 1});
			}
		}

		const groupedArray = Array.from(grouped.values());
		groupedArray.sort((a, b) => {
			switch (settings.sortBy) {
				case SortBy.Commits:
					return b.commits - a.commits;
				case SortBy.Insertions:
					return b.insertions - a.insertions;
				case SortBy.Deletions:
					return b.deletions - a.deletions;
				case SortBy.FilesChanged:
					return b.files_changed - a.files_changed;
				case SortBy.LinesChanged:
					return (b.insertions + b.deletions) - (a.insertions + a.deletions);
			}

			return 0;
		});
		return groupedArray;
	}, [commits, settings.sortBy]);

	// UseEffect(() => {
	// 	function cb(data: Commit[]) {
	// 		const grouped = new Map<string, Commit>();
	// 		for (const item of data) {
	// 			const stat = grouped.get(item.author);
	// 			if (stat) {
	// 				stat.commits += 1;
	// 				stat.insertions += item.insertions;
	// 				stat.deletions += item.deletions;
	// 				stat.files_changed += item.files_changed;
	// 			} else {
	// 				grouped.set(item.author, {...item, commits: 1});
	// 			}
	// 		}
	//
	// 		setOriginData(data);
	// 		data = Array.from(grouped.values());
	// 		data.sort((a, b) => {
	// 			switch (settings.sortBy) {
	// 				case SortBy.Commits:
	// 					return b.commits - a.commits;
	// 				case SortBy.Insertions:
	// 					return b.insertions - a.insertions;
	// 				case SortBy.Deletions:
	// 					return b.deletions - a.deletions;
	// 				case SortBy.FilesChanged:
	// 					return b.files_changed - a.files_changed;
	// 				case SortBy.LinesChanged:
	// 					return (b.insertions + b.deletions) - (a.insertions + a.deletions);
	// 			}
	//
	// 			return 0;
	// 		});
	// 		setGroupedData(data);
	// 	}
	//
	// 	menuEventEmitter.on(MenuEvent.OPEN, cb);
	// 	return () => {
	// 		menuEventEmitter.off(MenuEvent.OPEN, cb);
	// 	};
	// }, [settings.sortBy]);

	if (!groupedData) {
		return (
			<div className='flex flex-col justify-center items-center w-full h-full gap-2'>
				<h1 className='text-4xl'>Welcome to <b>Git Statistic</b></h1>
				<p className='mb-2'>Please open a repository first.</p>
				<button className='btn btn-wide btn-primary' onClick={pickRepo}>Open Repository...</button>
			</div>
		);
	}

	function onChangePath(index: number, newValue: string, paths: string[], setPaths: (paths: string[]) => void) {
		if (!newValue.trim()) {
			return;
		}

		paths = [...paths];
		paths[index] = newValue;
		setPaths(paths);
		return paths;
	}

	return (
		<div className='flex'>
			<div className='drawer drawer-open w-screen'>
				<input id='my-drawer-2' type='checkbox' className='drawer-toggle'/>
				<div className='drawer-content items-center justify-center'>
					{/* Page content here */}
					<Chart data={groupedData}/>

				</div>
				<div className='drawer-side bg-base-200'>
					<label htmlFor='my-drawer-2' aria-label='close sidebar' className='drawer-overlay'/>
					<div className='menu p-0 w-80 min-h-full text-base-content gap-3'>
						{/* Sidebar content here */}
						{/* <Summary commits={originData}/> */}
						<CountLimit/>
						<Sort/>
						<div className='divider m-0 h-[2px]'/>
						<PathList
							title='Included Paths' paths={settings.includedPaths}
							onAddPath={() => {
								settings.setIncludedPaths([...settings.includedPaths, '']);
							}}
							onDeletePath={index => {
								const newPaths = settings.includedPaths.filter((_, i) => i !== index);
								settings.setIncludedPaths(newPaths);
								void openRepo(settings.repo!, newPaths.concat(settings.excludedPaths)).then();
							}}
							onChangePath={(index, value) => {
								void openRepo(
									settings.repo!,
									onChangePath(index, value, settings.includedPaths, settings.setIncludedPaths)?.concat(
										settings.excludedPaths,
									) ?? [],
								).then();
							}}/>
						<PathList
							title='Excluded Paths' paths={settings.excludedPaths}
							onAddPath={() => {
								settings.setExcludedPaths([...settings.excludedPaths, '']);
							}}
							onDeletePath={index => {
								const newPaths = settings.excludedPaths.filter((_, i) => i !== index);
								settings.setExcludedPaths(newPaths);
								void openRepo(settings.repo!, settings.includedPaths.concat(newPaths)).then();
							}}
							onChangePath={(index, newValue) => {
								void openRepo(
									settings.repo!,
									settings.includedPaths.concat(
										onChangePath(index, newValue, settings.excludedPaths, settings.setExcludedPaths) ?? [],
									),
								).then();
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
