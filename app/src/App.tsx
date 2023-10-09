import './App.css';
import Chart from './Chart.tsx';
import {useEffect, useMemo, useState} from 'react';
import {type UserStat} from './types.ts';
import menuEventEmitter, {openRepo, pickRepo} from './open_repo.ts';
import {MenuEvent} from './events.ts';
import CountLimit from './components/CountLimit.tsx';
import {useHotkeys} from 'react-hotkeys-hook';
import {SortBy, useSettingsStore} from './SettingsState.ts';
import {useShallow} from 'zustand/react/shallow';
import Sort from './components/Sort.tsx';
import Summary from './components/Summary.tsx';

function App() {
	const [data, setData] = useState<UserStat[] | undefined>();

	const settings = useSettingsStore(useShallow(state => ({
		sortBy: state.sortBy,
		countLimitationEnabled: state.countLimitationEnabled,
		countLimitation: state.countLimitation,
	})));

	const processed = useMemo(() => {
		if (!data) {
			return undefined;
		}

		// eslint-disable-next-line array-callback-return
		let result = data?.sort((a, b) => {
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
		})?.concat([]);

		if (settings.countLimitationEnabled) {
			if (settings.countLimitation) {
				result = result.slice(0, settings.countLimitation);
			}
		}

		return result;
	}, [data, settings]);

	useHotkeys('mod+o', pickRepo);
	// Open last repo

	useEffect(() => {
		const repo = localStorage.getItem('repo');
		if (repo) {
			void openRepo(repo).then();
		}
	}, []);
	// Listen to open repo event

	useEffect(() => {
		function cb(data: UserStat[]) {
			setData(data);
		}

		menuEventEmitter.on(MenuEvent.OPEN, cb);
		return () => {
			menuEventEmitter.off(MenuEvent.OPEN, cb);
		};
	}, []);

	if (!processed) {
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
					<Chart data={processed}/>

				</div>
				<div className='drawer-side bg-base-200'>
					<label htmlFor='my-drawer-2' aria-label='close sidebar' className='drawer-overlay'/>
					<div className='menu z-[0] p-4 w-80 min-h-full text-base-content gap-2'>
						<Summary data={data!}/>
						<CountLimit/>
						<Sort/>
						{/* Sidebar content here */}
						<li><a>Sidebar Item 1</a></li>
						<li><a>Sidebar Item 2</a></li>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
