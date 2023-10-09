import {useSettingsStore} from '../SettingsState.ts';
import {useShallow} from 'zustand/react/shallow';
import NumberInput from './NumberInput.tsx';

export default function CountLimit() {
	const settings = useSettingsStore(useShallow(state => ({
		countLimitation: state.countLimitation,
		countLimitationEnabled: state.countLimitationEnabled,
		setCountLimitation: state.setCountLimitation,
		setCountLimitationEnabled: state.setCountLimitationEnabled,
	})));

	return (
		<div className='flex items-center gap-2 px-4 font-medium'>
			<input
				checked={settings.countLimitationEnabled} type='checkbox' className='toggle toggle-xs'
				onChange={() => {
					settings.setCountLimitationEnabled(!settings.countLimitationEnabled);
				}}/>
			<span>Top</span>
			<NumberInput
				disabled={!settings.countLimitationEnabled}
				defaultValue={settings.countLimitation}
				min={0}
				max={100}
				className='w-16'
				onConfirm={value => {
					settings.setCountLimitation(value);
				}}
			/>
			<span>Users</span>

		</div>
	);
}
