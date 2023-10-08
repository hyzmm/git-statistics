import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@icon-park/react/styles/index.css';

import {pickRepo} from './open_repo.ts';
import {listen} from '@tauri-apps/api/event';
import {MenuEvent} from './events.ts';

void listen(MenuEvent.OPEN, pickRepo).then();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
);
