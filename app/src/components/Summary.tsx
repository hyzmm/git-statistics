type SummaryProps = {
	readonly totalCommits: number;
};

export default function Summary({totalCommits}: SummaryProps) {
	return (
		<div className='stats shadow h-28 w-full rounded-none'>
			<div className='stat'>
				<div className='stat-title'>Total Commits</div>
				<div className='stat-value'>{totalCommits}
				</div>
				<div className='stat-desc'>{0} Lines Changed</div>
			</div>

		</div>
	);
}
