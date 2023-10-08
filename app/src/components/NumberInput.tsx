import React, {type FocusEvent, useCallback} from 'react';
import {clsx} from 'clsx';
import {clamp} from 'lodash-es';

/* eslint-disable @typescript-eslint/consistent-type-definitions */
interface NumberInputProps extends React.HTMLProps<HTMLInputElement> {
	readonly onConfirm?: (value: number) => void;
}

export default function NumberInput({onConfirm, onChange, defaultValue, className, ...props}: NumberInputProps & React.HTMLProps<HTMLInputElement>) {
	const [previous, setPrevious] = React.useState<NumberInputProps['defaultValue']>(defaultValue);

	const onKeydown = useCallback((e: React.KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
		if (e.type === 'keydown' && (e as never as KeyboardEvent).key !== 'Enter') {
			return;
		}

		if (e.currentTarget.value === '') {
			e.currentTarget.value = String(previous);
		}

		let value = Number(e.currentTarget.value);
		value = clamp(value, props.min as number ?? -Infinity, props.max as number ?? Infinity);
		e.currentTarget.value = String(value);
		onConfirm?.(value);
	}, [onConfirm, previous]);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e);
		if (e.currentTarget.value === '') {
			return;
		}

		setPrevious(e.currentTarget.value);
	}, [onChange]);

	return (
		<input
			type='number'
			className={clsx(['input input-xs input-bordered', className])}
			defaultValue={defaultValue}
			onInput={handleChange}
			onKeyDown={onKeydown}
			onBlur={onKeydown}
			{...props}
		/>
	);
}
