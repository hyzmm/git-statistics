import {useEffect, useRef, useState} from 'react';
import * as echarts from 'echarts';
import {type UserStat} from './types.ts';
import {type SeriesLabelOption} from 'echarts/types/src/util/types';
import {ChartHistogramTwo, ChartProportion} from '@icon-park/react';

type PieChartProps = {
	readonly data: UserStat[];
};

export default function Chart({data}: PieChartProps) {
	const chart = useRef<echarts.EChartsType>();
	const ref = useRef<HTMLDivElement>(null);
	const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

	useEffect(() => {
		chart.current ??= echarts.init(ref.current, 'dark');
		chart.current.setOption(
			chartType === 'bar' ? getBarChartOptions(data) : getPieChartOptions(data),
			true,
		);
	}, [data, chartType]);

	useEffect(() => {
		function cb() {
			chart.current!.resize();
		}

		window.addEventListener('resize', cb);
		return () => {
			window.removeEventListener('resize', cb);
		};
	}, []);

	return (
		<div className='w-full h-full relative'>
			<div
				ref={ref} className='w-full h-full'/>
			{/* switch button */}
			<label
				className='absolute z-10 right-2 bottom-10 btn btn-sm btn-primary btn-circle swap swap-rotate'
			>
				<input
					type='checkbox'
					onClick={() => {
						setChartType(chartType === 'bar' ? 'pie' : 'bar');
					}}
				/>
				<ChartProportion
					className='swap-off fill-current' theme='outline' size='18'
					onClick={() => {
						console.log(1);
					}}/>
				<ChartHistogramTwo className='swap-on fill-current' theme='outline' size='18'/>
			</label>
		</div>
	);
}

function getBarChartOptions(data: UserStat[]): echarts.EChartsOption {
	const labelOption: echarts.BarSeriesOption['label'] = {
		show: true,
		position: 'insideBottom',
		distance: 15,
		align: 'left',
		verticalAlign: 'middle',
		rotate: 90,
		formatter: '{c}',
		fontSize: 16,
	};

	return {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['Commits', 'Files Changed', 'Insertions', 'Deletions', 'Lines Changed'],
			top: 10,
		},
		toolbox: {
			show: true,
			orient: 'vertical',
			left: 'right',
			top: 'center',
			feature: {
				mark: {show: true},
				magicType: {show: true, type: ['line', 'bar', 'stack']},
				restore: {show: true},
			},
		},
		xAxis: [
			{
				type: 'category',
				axisTick: {show: true, inside: true},
				data: data.map(e => e.author),
			},
		],
		yAxis: [
			{
				type: 'value',
			},
		],
		dataZoom: [
			{
				show: true,
				realtime: true,
				start: 0,
				end: 4 / data.length * 100,
			},
			{
				type: 'inside',
				realtime: true,
				start: 0,
				end: 4 / data.length * 100,
			},
		],
		series: [
			{
				name: 'Commits',
				type: 'bar',
				label: labelOption,
				emphasis: {
					focus: 'series',
				},
				data: data.map(e => e.commits),
			},
			{
				name: 'Files Changed',
				type: 'bar',
				label: labelOption,
				emphasis: {
					focus: 'series',
				},
				data: data.map(e => e.files_changed),
			},
			{
				name: 'Insertions',
				type: 'bar',
				label: labelOption,
				color: '#3ba272',
				emphasis: {
					focus: 'series',
				},
				data: data.map(e => e.insertions),
			},
			{
				name: 'Deletions',
				type: 'bar',
				color: '#ee6666',
				label: labelOption,
				emphasis: {
					focus: 'series',
				},
				data: data.map(e => e.deletions),
			},
			{
				name: 'Lines Changed',
				type: 'bar',
				label: labelOption,
				emphasis: {
					focus: 'series',
				},
				data: data.map(e => e.insertions + e.deletions),
			},
		],
	};
}

function getPieChartOptions(data: UserStat[]): echarts.EChartsOption {
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

	const radiusGenerator = getTrackRadius();

	return {
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		},
		legend: {
			data: data.map(e => e.author),
			bottom: 10,
			type: 'scroll',
			orient: 'horizontal',
		},
		xAxis: undefined,
		dataZoom: [],
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
}
