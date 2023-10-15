import {useEffect, useState} from 'react';
import {invoke} from '@tauri-apps/api';
import {useSettingsStore} from '../SettingsState.ts';

export default function Summary() {
	const {repo, getPathspec, includedPaths, excludedPaths, commits} = useSettingsStore(state => ({
		repo: state.repo,
		commits: state.commits,
		getPathspec: state.getPathspec,
		includedPaths: state.includedPaths,
		excludedPaths: state.excludedPaths,

	}));

	const [files, setFiles] = useState(0);

	useEffect(() => {
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
