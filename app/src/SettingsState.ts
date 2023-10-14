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
	countLimitationEnabled: boolean;
	countLimitation: number;
	sortBy: SortBy;

	includedPaths: string[];
	excludedPaths: string[];

	setRepo(repo: string, commits: Commit[]): void;
	setCountLimitationEnabled(enabled: boolean): void;
	setCountLimitation(value: number): void;
	setSortBy(sortBy: SortBy): void;

	addIncludedPath(path: string): void;
	setIncludedPaths(paths: string[]): void;
	setExcludedPaths(paths: string[]): void;
	getPathspec(): string[];
};

export const useSettingsStore = create<SettingsState>()(
	devtools(
		persist(
			(set, get) => ({
				repo: undefined,
				countLimitationEnabled: true,
				countLimitation: 10,
				sortBy: SortBy.Commits,
				includedPaths: [],
				excludedPaths: [],

				commits: [],

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
				addIncludedPath(path: string) {
					set({
						includedPaths: [...get().includedPaths, path],
					});
				},
				setIncludedPaths(paths: string[]) {
					set({
						includedPaths: paths,
					});
				},
				setExcludedPaths(paths: string[]) {
					set({
						excludedPaths: paths,
					});
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
const {repo, includedPaths, excludedPaths} = useSettingsStore.getState();
if (repo) {
	void openRepo(repo, includedPaths.concat(excludedPaths.map(path => `:!${path}`))).then();
}
