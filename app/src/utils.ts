import {path} from '@tauri-apps/api';

export class PathUtils {
	static async convertToTildePath(p: string): Promise<string> {
		if (p.startsWith(await path.homeDir())) {
			return p.replace(await path.homeDir(), '~' + path.sep);
		}

		return p;
	}
}
