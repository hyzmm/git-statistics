import {SortBy, useSettingsStore} from '../SettingsState.ts';
import {useRef} from 'react';
import {useShallow} from 'zustand/react/shallow';

export default function Sort() {
	const settings = useSettingsStore(useShallow(state => ({
		sortBy: state.sortBy,
		setSortBy: state.setSortBy,
	})));

	const dropdownRef = useRef<HTMLDetailsElement>(null);
	return (
		<div className='flex items-center gap-2 px-4'>
			<span className='font-medium'>
				Sort by
			</span>

			<details ref={dropdownRef} className='dropdown'>
				<summary
					tabIndex={0}
					className='btn btn-neutral btn-xs'
				>{settings.sortBy}
				</summary>
				<ul tabIndex={0} className='dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52'>
					{
						Object.values(SortBy).map(v => (
							<li
								key={v} onClick={() => {
									settings.setSortBy(v);
									dropdownRef.current!.removeAttribute('open');
								}}
							><a>{v.toString()}</a>
							</li>
						))
					}
				</ul>
			</details>
		</div>
	);
}
