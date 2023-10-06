
import './App.css';
import Chart from './Chart.tsx';
import {useEffect, useState} from 'react';
import {type UserStat} from './types.ts';
import menuEventEmitter, {handleOpenRepo} from './menu.ts';
import {MenuEvent} from './events.ts';
function App() {
	const [data, setData] = useState<UserStat[] | undefined>();

	useEffect(() => {
		function cb(data: UserStat[]) {
			setData(data);
		}

		menuEventEmitter.on(MenuEvent.OPEN, cb);
		return () => {
			menuEventEmitter.off(MenuEvent.OPEN, cb);
		};
	});

	if (!data) {
		return (
			<div className='container flex flex-col justify-center items-center w-full h-full gap-2'>
				<h1 className='text-4xl'>Welcome to <b>Git Statistic</b></h1>
				<p className='mb-2'>Please open a repository first.</p>
				<button className='btn btn-wide btn-primary' onClick={handleOpenRepo}>Open Repository...</button>
			</div>
		);
	}

	return (
		<div className='flex'>
			<div className='drawer drawer-open w-screen'>
				<input id='my-drawer-2' type='checkbox' className='drawer-toggle'/>
				<div className='drawer-content items-center justify-center'>
					{/* Page content here */}
					<Chart data={data}/>

				</div>
				<div className='drawer-side'>
					<label htmlFor='my-drawer-2' aria-label='close sidebar' className='drawer-overlay'/>
					<ul className='menu p-4 w-80 min-h-full bg-base-200 text-base-content'>
						{/* Sidebar content here */}
						<li><a>Sidebar Item 1</a></li>
						<li><a>Sidebar Item 2</a></li>
					</ul>

				</div>
			</div>
		</div>
	);
}

export default App;
