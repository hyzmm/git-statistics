import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {type Commit} from './types.ts';
import {openRepo} from './open_repo.ts';

export enum SortBy {
	Commits = 'Commits',
	FilesChanged = 'Files Changed',
	Insertions = 'Insertions',
	Deletions = 'Deletions',
	LinesChanged = 'Lines Changed',
}

export type SettingsState = {
	commits: Commit[];
	repo: string | undefined;
	loading: boolean;

	countLimitationEnabled: boolean;
	countLimitation: number;
	sortBy: SortBy;

	includedPaths: string[];
	excludedPaths: string[];

	setLoading(loading: boolean): void;
	setRepo(repo: string, commits: Commit[]): void;
	setCountLimitationEnabled(enabled: boolean): void;
	setCountLimitation(value: number): void;
	setSortBy(sortBy: SortBy): void;

	addIncludedPath(path?: string): void;
	removeIncludedPath(index: number): void;
	changeIncludedPath(index: number, path: string): void;
	addExcludedPath(path?: string): void;
	removeExcludedPath(index: number): void;
	changeExcludedPath(index: number, path: string): void;
	getPathspec(): string[];
};

export const useSettingsStore = create<SettingsState>()(
	devtools(
		persist(
			(set, get) => ({
				repo: undefined,
				commits: [],
				loading: false,

				countLimitationEnabled: true,
				countLimitation: 10,
				sortBy: SortBy.Commits,
				includedPaths: [],
				excludedPaths: [],

				setLoading(loading: boolean) {
					set({
						loading,
					});
				},
				setRepo(repo: string, commits: Commit[]) {
					set({
						repo,
						commits,
					});
				},
				setCountLimitationEnabled(enabled: boolean) {
					set({
						countLimitationEnabled: enabled,
					});
				},
				setCountLimitation(value: number) {
					set({
						countLimitation: value,
					});
				},
				setSortBy(sortBy: SortBy) {
					set({
						sortBy,
					});
				},
				addIncludedPath(path = '') {
					set({
						includedPaths: [...get().includedPaths, path],
					});
				},
				removeIncludedPath(index: number) {
					const item = get().includedPaths[index];
					set({
						includedPaths: get().includedPaths.filter((_, i) => i !== index),
					});
					if (item) {
						reopen();
					}
				},
				changeIncludedPath(index: number, path: string) {
					const item = get().includedPaths[index];
					set({
						includedPaths: get().includedPaths.map((e, i) => i === index ? path : e),
					});
					if (item !== path) {
						reopen();
					}
				},
				addExcludedPath(path = '') {
					set({
						excludedPaths: [...get().excludedPaths, path],
					});
				},
				removeExcludedPath(index: number) {
					const item = get().excludedPaths[index];
					set({
						excludedPaths: get().excludedPaths.filter((_, i) => i !== index),
					});
					if (item) {
						reopen();
					}
				},
				changeExcludedPath(index: number, path: string) {
					const item = get().excludedPaths[index];
					set({
						excludedPaths: get().excludedPaths.map((e, i) => i === index ? path : e),
					});
					if (item !== path) {
						reopen();
					}
				},
				getPathspec(): string[] {
					return [...get().includedPaths.filter(e => e.trim().length > 0), ...get().excludedPaths.filter(e => e.trim().length > 0).map(path => `:!${path}`)];
				},
			}),
			{
				name: 'settings',
				partialize: state => Object.fromEntries(Object.entries(state).filter(([key]) => !['commits'].includes(key))),
			},
		),
	),
);

reopen();

function reopen() {
	let {repo, includedPaths, excludedPaths} = useSettingsStore.getState();

	includedPaths = includedPaths.filter(e => e.trim().length > 0);
	excludedPaths = excludedPaths.filter(e => e.trim().length > 0).map(path => `:!${path}`);

	if (repo) {
		void openRepo(repo, includedPaths.concat(excludedPaths)).then();
	}
}
