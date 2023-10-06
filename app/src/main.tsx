import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@icon-park/react/styles/index.css';

import {invoke} from '@tauri-apps/api';
import {type UserStat} from './types.ts';

// Invoke<Array<[string, UserStat]>>('git_stats', {repo: '/Users/xiang/Documents/iDreamSky/fanbook_web'})
// 	.then(response => {
// 		console.log(JSON.stringify(response));
// 	});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
);
