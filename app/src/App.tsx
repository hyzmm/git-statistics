import './App.css';
import Chart from './Chart.tsx';
import {useMemo} from 'react';
import {type Commit} from './types.ts';
import {pickRepo} from './open_repo.ts';
import {useHotkeys} from 'react-hotkeys-hook';
import {SortBy, useSettingsStore} from './SettingsState.ts';
import {useShallow} from 'zustand/react/shallow';
import SideBar from './components/SideBar.tsx';

function App() {
	const {commits, ...settings} = useSettingsStore(useShallow(state => ({
		commits: state.commits,
		repo: state.repo,
		sortBy: state.sortBy,
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
						<SideBar/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
