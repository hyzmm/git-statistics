import Summary from './Summary.tsx';
import CountLimit from './CountLimit.tsx';
import Sort from './Sort.tsx';
import PathList from './PathList.tsx';
import {useSettingsStore} from '../SettingsState.ts';
import {useShallow} from 'zustand/react/shallow';

export default function SideBar() {
	const {
		includedPaths,
		addIncludedPath,
		removeIncludedPath,
		changeIncludedPath,
		excludedPaths,
		addExcludedPath,
		removeExcludedPath,
		changeExcludedPath,
	} = useSettingsStore(useShallow(state => ({
		commits: state.commits,
		repo: state.repo,
		sortBy: state.sortBy,
		includedPaths: state.includedPaths,
		excludedPaths: state.excludedPaths,
		addIncludedPath: state.addIncludedPath,
		removeIncludedPath: state.removeIncludedPath,
		changeIncludedPath: state.changeIncludedPath,
		addExcludedPath: state.addExcludedPath,
		removeExcludedPath: state.removeExcludedPath,
		changeExcludedPath: state.changeExcludedPath,
		countLimitationEnabled: state.countLimitationEnabled,
		countLimitation: state.countLimitation,
	})));
	return (
		<div className='text-base-content flex flex-col h-full'>
			<Summary/>
			<div className='pt-3 flex-1 overflow-y-auto'>
				<div className='flex flex-col gap-3'>
					<CountLimit/>
					<Sort/>
					<div className='divider m-0 h-[2px]'/>
					<PathList
						title='Included Paths' paths={includedPaths}
						onAddPath={addIncludedPath}
						onDeletePath={removeIncludedPath}
						onChangePath={changeIncludedPath}/>
					<PathList
						title='Excluded Paths' paths={excludedPaths}
						onAddPath={addExcludedPath}
						onDeletePath={removeExcludedPath}
						onChangePath={changeExcludedPath}
					/>
				</div>
			</div>
		</div>
	);
}
