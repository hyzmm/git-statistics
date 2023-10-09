import React, {type FocusEvent, useCallback} from 'react';

export default function InputWithConfirm({onConfirm, ...props}: {
	readonly onConfirm: (value: string) => void;
} & React.HTMLProps<HTMLInputElement>) {
	const handleConfirm = useCallback((e: React.KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
		if (e.type === 'keydown') {
			if ((e as never as KeyboardEvent).key !== 'Enter') {
				return;
			}

			props.onKeyDown?.(e as never as React.KeyboardEvent<HTMLInputElement>);
		} else {
			props.onBlur?.(e as never as FocusEvent<HTMLInputElement>);
		}

		onConfirm(e.currentTarget.value);
	}, [onConfirm]);

	return <input {...props} onBlur={handleConfirm} onKeyDown={handleConfirm}/>;
}
