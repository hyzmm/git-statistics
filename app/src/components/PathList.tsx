import InputWithConfirm from './InputWithConfirm.tsx';
import React from 'react';
import {Minus} from '@icon-park/react';
import {clsx} from 'clsx';

type PathListProps = {
	readonly title: string;
	readonly paths: string[];
	readonly onAddPath: () => void;
	readonly onDeletePath: (index: number) => void;
	readonly onChangePath: (index: number, value: string) => void;
};

export default function PathList({title, paths, ...props}: PathListProps) {
	return (
		<div className='collapse collapse-arrow bg-base-200'>
			<input type='checkbox' className='min-h-0 py-0'/>
			<div className='collapse-title text-lg font-medium min-h-0 py-0'>
				<div className='flex items-center'>
					<span>{title}</span>
					{Boolean(paths.length) && <div className='badge ml-1'>{paths.length}</div>}
				</div>
			</div>

			<div className='collapse-content flex flex-col'>
				{
					paths.map((path, index) => (
						<PathInput
							key={index}
							defaultValue={path}
							onConfirm={value => {
								props.onChangePath(index, value);
							}}
							onDelete={() => {
								props.onDeletePath(index);
							}}
						/>
					))
				}
				<button
					className='btn btn-block btn-neutral btn-xs mt-2' onClick={() => {
						props.onAddPath();
					}}
				>Add Path
				</button>
			</div>
		</div>
	);
}

function PathInput({onDelete, ...props}: {
	readonly onConfirm: (value: string) => void;
	readonly onDelete: () => void;
} & React.HTMLProps<HTMLInputElement>) {
	const [focused, setFocused] = React.useState(false);
	const [hovered, setHovered] = React.useState(false);

	return (
		<div
			className='relative pt-2'
			onMouseEnter={() => {
				setHovered(true);
			}}
			onMouseLeave={() => {
				setHovered(false);
			}}
		>
			<InputWithConfirm
				autoCorrect='off'
				autoCapitalize='off'
				spellCheck={false}
				type='text'
				placeholder='Specify Path...'
				className='input input-xs input-ghost w-full max-w-xs'
				onFocus={() => {
					setFocused(true);
				}}
				onBlur={() => {
					setFocused(false);
				}}
				{...props}
			/>
			<Minus
				theme='outline' size='16'
				className={clsx(['cursor-pointer absolute right-1 w-6 h-6 p-1 duration-300 ease-in-out transition-opacity', !focused && !hovered && 'opacity-0'])}
				onClick={() => {
					onDelete();
				}}/>
		</div>
	);
}
