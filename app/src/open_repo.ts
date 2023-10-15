import {dialog, invoke, window} from '@tauri-apps/api';
import {type Commit} from './types.ts';
import {PathUtils} from './utils.ts';
import {useSettingsStore} from './SettingsState.ts';

export async function pickRepo() {
	const repo = await dialog.open({
		directory: true,
	}) as string | undefined;
	if (!repo) {
		return;
	}

	await openRepo(repo);
}

export async function openRepo(repo: string, pathspec: string[] = []) {
	console.log('openRepo', repo, pathspec);
	const state = useSettingsStore.getState();
	state.setLoading(true);

	void invoke<Commit[]>('git_stats', {repo, pathspec})
		.then(response => {
			state.setRepo(repo, response);
		}).catch((err: string) => {
			void dialog.message(err, {type: 'error', title: 'Error'});
		}).finally(() => {
			state.setLoading(false);
		});

	await window.appWindow.setTitle(`Git Statistics: ${await PathUtils.convertToTildePath(repo)}`);
}

