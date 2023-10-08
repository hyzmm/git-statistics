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

	setCountLimitationEnabled(enabled: boolean): void;
	setCountLimitation(value: number): void;
	setSortBy(sortBy: SortBy): void;
};

export const useSettingsStore = create<SettingsState>()(
	devtools(
		persist(
			set => ({
				countLimitationEnabled: true,
				countLimitation: 10,
				sortBy: SortBy.Commits,

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
			}),
			{
				name: 'settings',
			},
		),
	),
);
