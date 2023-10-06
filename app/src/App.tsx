/* eslint-disable @typescript-eslint/naming-convention */
import './App.css';
import Chart from './Chart.tsx';

let demo = [['HUA616436641', {
	author: '',
	commits: 2,
	deletions: 69,
	files_changed: 7,
	insertions: 107,
}], ['git_idreamsky', {
	author: '',
	commits: 1,
	deletions: 0,
	files_changed: 1,
	insertions: 0,
}], ['SCWR', {
	author: '',
	commits: 182,
	deletions: 8526,
	files_changed: 1184,
	insertions: 25298,
}], ['hyzm', {
	author: '',
	commits: 5,
	deletions: 194,
	files_changed: 41,
	insertions: 1198,
}], ['bob.liao', {
	author: '',
	commits: 13,
	deletions: 34260,
	files_changed: 92,
	insertions: 9244,
}], ['binary', {
	author: '',
	commits: 295,
	deletions: 104801,
	files_changed: 1609,
	insertions: 140259,
}], ['huanhua.li', {author: '', commits: 87, deletions: 19858, files_changed: 693, insertions: 67060}]];
demo = demo.map(([author, stat]) => ({
	...stat,
	author,
}));
demo.sort((a, b) => a.commits - b.commits);

function App() {
	return (
		<div className='flex'>
			<div className='drawer drawer-open w-screen'>
				<input id='my-drawer-2' type='checkbox' className='drawer-toggle'/>
				<div className='drawer-content items-center justify-center'>
					{/* Page content here */}
					<Chart data={demo}/>

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
