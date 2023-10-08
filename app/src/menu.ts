import {listen} from '@tauri-apps/api/event';
import {MenuEvent} from './events.ts';
import {dialog, invoke, window} from '@tauri-apps/api';
import {type UserStat} from './types.ts';
import {PathUtils} from './utils.ts';
import {register} from '@tauri-apps/api/globalShortcut';
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

export async function openRepo(repo: string) {
	void invoke<Array<[string, UserStat]>>('git_stats', {repo})
		.then(response => {
			const data = response.map(([author, stat]) => ({
				...stat,
				author,
			}));
			menuEventEmitter.emit(MenuEvent.OPEN, data);
			localStorage.setItem('repo', repo);
		}).catch((err: string) => {
			void dialog.message(err, {type: 'error', title: 'Error'});
		});

	await window.appWindow.setTitle(`Git Statistics: ${await PathUtils.convertToTildePath(repo)}`);
}

export function startListenOpenRepo() {
	void register('CommandOrControl+O', pickRepo).then();
	void listen(MenuEvent.OPEN, pickRepo).then();
}
