import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@icon-park/react/styles/index.css';

import {startListenOpenRepo} from './menu.ts';

startListenOpenRepo();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
);
