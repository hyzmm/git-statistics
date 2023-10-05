import {useEffect, useRef} from 'react';
import * as echarts from 'echarts';
import {type UserStat} from './types.ts';
import {type SeriesLabelOption} from 'echarts/types/src/util/types';

type PieChartProps = {
	readonly data: UserStat[];
};

const labelOptions: SeriesLabelOption = {
	show: false,
	formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
	backgroundColor: '#F6F8FC',
	borderColor: '#8C8D8E',
	borderWidth: 1,
	borderRadius: 4,
	rich: {
		a: {
			color: '#6E7079',
			lineHeight: 22,
			align: 'center',
		},
		hr: {
			borderColor: '#8C8D8E',
			width: '100%',
			borderWidth: 1,
			height: 0,
		},
		b: {
			color: '#4C5058',
			fontSize: 14,
			fontWeight: 'bold',
			lineHeight: 33,
		},
		per: {
			color: '#fff',
			backgroundColor: '#4C5058',
			padding: [3, 4],
			borderRadius: 4,
		},
	},
};

function * getTrackRadius(): Generator<string[]> {
	const trackWidth = 10;
	const trackGap = 5;
	let trackStart = 25;

	while (true) {
		yield [`${trackStart}%`, `${trackStart + trackWidth}%`];
		trackStart += trackWidth + trackGap;
	}
}

export default function PieChart({data}: PieChartProps) {
	const chart = useRef<echarts.EChartsType>();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		chart.current = echarts.init(ref.current, 'dark');

		const radiusGenerator = getTrackRadius();
		const option: echarts.EChartsOption = {
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)',
			},
			legend: {
				data: data.map(e => e.author),
				bottom: 10,
			},
			series:
				[
					{
						name: 'Commits',
						type: 'pie',
						radius: [0, '20%'],
						label: {
							position: 'inner',
							fontSize: 14,
						},
						data: data.map(e => ({
							value: e.commits,
							name: e.author,
						})),
					},
					{
						type: 'pie',
						label: labelOptions,
						name: 'Files Changed',
						radius: radiusGenerator.next().value as string[],
						data: data.map(e => ({
							value: e.files_changed,
							name: e.author,
						})),
					},
					{
						type: 'pie',
						label: labelOptions,
						name: 'Insertions',
						radius: radiusGenerator.next().value as string[],
						data: data.map(e => ({
							value: e.insertions,
							name: e.author,
						})),
					},
					{
						type: 'pie',
						label: labelOptions,
						name: 'Deletions',
						radius: radiusGenerator.next().value as string[],
						data: data.map(e => ({
							value: e.deletions,
							name: e.author,
						})),
					},
					{
						type: 'pie',
						labelLine: {
							length: 30,
						},
						label: labelOptions,
						name: 'Lines Changed',
						radius: radiusGenerator.next().value as string[],
						data: data.map(e => ({
							value: e.insertions + e.deletions,
							name: e.author,
						})),
					},
				],
		};

		chart.current.setOption(option);

		chart.current?.on('mouseover', params => {
			console.log(params);
		});
	}, [data]);

	useEffect(() => {
		function cb() {
			chart.current!.resize();
		}

		window.addEventListener('resize', cb);
		return () => {
			window.removeEventListener('resize', cb);
		};
	}, []);

	return <div ref={ref} className='w-full h-full'/>;
}
