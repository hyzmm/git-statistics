import {clsx} from 'clsx';
import {CheckSmall} from '@icon-park/react';
import {useSettingsStore} from '../SettingsState.ts';

export default function StatusBar() {
	const {loading} = useSettingsStore(state => ({
		loading: state.loading,
	}));

	return (
		<footer className='footer bg-base-300 text-base-content p-1 px-2'>
			<div className='flex items-center gap-2 text-xs'>
				<label className={clsx(['swap swap-rotate', loading && 'swap-active'])}>
					<span className='swap-on loading loading-infinity loading-sm'/>
					<CheckSmall className='swap-off' theme='outline' size='20'/>
				</label>
				{loading ? 'Loading' : 'Ready'}
			</div>
		</footer>
	);
}
