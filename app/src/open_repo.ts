import {MenuEvent} from './events.ts';
import {dialog, invoke, window} from '@tauri-apps/api';
import {type Commit} from './types.ts';
import {PathUtils} from './utils.ts';
import EventEmitter from 'eventemitter3';
import {useSettingsStore} from './SettingsState.ts';

const menuEventEmitter = new EventEmitter();
export default menuEventEmitter;

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
	void invoke<Commit[]>('git_stats', {repo, pathspec})
		.then(response => {
			menuEventEmitter.emit(MenuEvent.OPEN, response);
			useSettingsStore.getState().setRepo(repo, response);
		}).catch((err: string) => {
			void dialog.message(err, {type: 'error', title: 'Error'});
		});

	await window.appWindow.setTitle(`Git Statistics: ${await PathUtils.convertToTildePath(repo)}`);
}

