import {useEffect, useState} from 'react';
import {invoke} from '@tauri-apps/api';
import {useSettingsStore} from '../SettingsState.ts';
import {type Commit} from '../types.ts';

type SummaryProps = {
	readonly commits: Commit[];
};

export default function Summary({commits}: SummaryProps) {
	const {repo, getPathspec, includedPaths, excludedPaths} = useSettingsStore(state => ({
		repo: state.repo,
		getPathspec: state.getPathspec,
		includedPaths: state.includedPaths,
		excludedPaths: state.excludedPaths,

	}));

	const [files, setFiles] = useState(0);

	useEffect(() => {
		console.log('get total files');
		invoke('git_total_files', {repo, pathspec: getPathspec()}).then(result => {
			setFiles(result as number);
		}).catch(console.error);
	}, [repo, includedPaths, excludedPaths, getPathspec]);

	return (
		<div className='stats shadow h-28 w-full rounded-none'>
			<div className='stat'>
				<div className='stat-title'>Total Commits</div>
				<div className='stat-value'>{commits.length}
				</div>
				<div className='stat-desc'>{files} Files</div>
			</div>
		</div>
	);
}
