import {type UserStat} from '../types.ts';

type SummaryProps = {
	readonly data: UserStat[];
};

export default function Summary({data}: SummaryProps) {
	const totalLinesChanged = data.reduce((p, c) => p + c.insertions + c.deletions, 0);
	return (
		<div className='stats shadow h-28 w-full'>
			<div className='stat'>
				<div className='stat-title'>Total Commits</div>
				<div className='stat-value'>{data.reduce((p, c) => p + c.commits, 0)}
				</div>
				<div className='stat-desc'>{totalLinesChanged} Lines Changed</div>
			</div>

		</div>
	);
}
