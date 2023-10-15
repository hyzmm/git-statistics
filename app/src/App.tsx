import './App.css';
import Chart from './Chart.tsx';
import {useMemo} from 'react';
import {type Commit} from './types.ts';
import {pickRepo} from './open_repo.ts';
import {useHotkeys} from 'react-hotkeys-hook';
import {SortBy, useSettingsStore} from './SettingsState.ts';
import {useShallow} from 'zustand/react/shallow';
import SideBar from './components/SideBar.tsx';
import StatusBar from './components/StatusBar.tsx';

function App() {
	const {commits, countLimitation, countLimitationEnabled, ...settings} = useSettingsStore(useShallow(state => ({
		commits: state.commits,
		repo: state.repo,
		sortBy: state.sortBy,
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

	const sortedData = useMemo(() => {
		if (countLimitationEnabled) {
			if (countLimitation) {
				return groupedData.slice(0, countLimitation);
			}
		}

		return undefined;
	}, [countLimitation, countLimitationEnabled, groupedData]);

	if (!groupedData) {
		return (
			<div className='flex flex-col justify-center items-center w-full h-full gap-2'>
				<h1 className='text-4xl'>Welcome to <b>Git Statistic</b></h1>
				<p className='mb-2'>Please open a repository first.</p>
				<button className='btn btn-wide btn-primary' onClick={pickRepo}>Open Repository...</button>
			</div>
		);
	}

	return (
		<div className='flex flex-col w-full h-full'>
			{/* Top */}
			<div className='w-screen flex flex-1 overflow-hidden'>
				<div className='bg-base-200 w-72 h-full'>
					<SideBar/>
				</div>

				<div className='flex-1 h-full'>
					{/* Page content here */}
					<Chart data={sortedData ?? groupedData}/>
				</div>
			</div>
			<StatusBar/>
		</div>
	);
}

export default App;
