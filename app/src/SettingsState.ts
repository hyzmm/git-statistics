import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

export enum SortBy {
	Commits = 'Commits',
	FilesChanged = 'Files Changed',
	Insertions = 'Insertions',
	Deletions = 'Deletions',
	LinesChanged = 'Lines Changed',
}

export type SettingsState = {
	countLimitationEnabled: boolean;
	countLimitation: number;
	sortBy: SortBy;

	includedPaths: string[];
	excludedPaths: string[];

	setCountLimitationEnabled(enabled: boolean): void;
	setCountLimitation(value: number): void;
	setSortBy(sortBy: SortBy): void;

	setIncludedPaths(paths: string[]): void;
	setExcludedPaths(paths: string[]): void;
};

export const useSettingsStore = create<SettingsState>()(
	devtools(
		persist(
			set => ({
				countLimitationEnabled: true,
				countLimitation: 10,
				sortBy: SortBy.Commits,
				includedPaths: [],
				excludedPaths: [],

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
			}),
			{
				name: 'settings',
			},
		),
	),
);
