import {MenuEvent} from './events.ts';
import {dialog, invoke, window} from '@tauri-apps/api';
import {type UserStat} from './types.ts';
import {PathUtils} from './utils.ts';
import EventEmitter from 'eventemitter3';

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

export async function openRepo(repo: string, includedPaths: string[] = [], excludedPaths: string[] = []) {
	includedPaths = [...includedPaths, ...excludedPaths.map(path => `:!${path}`)];
	console.log('openRepo', repo, includedPaths, excludedPaths);
	void invoke<Array<[string, UserStat]>>('git_stats', {repo, pathspec: includedPaths})
		.then(response => {
			menuEventEmitter.emit(MenuEvent.OPEN, response);
			localStorage.setItem('repo', repo);
		}).catch((err: string) => {
			void dialog.message(err, {type: 'error', title: 'Error'});
		});

	await window.appWindow.setTitle(`Git Statistics: ${await PathUtils.convertToTildePath(repo)}`);
}

