import {useEffect, useMemo, useState} from 'react';

export default function useColorScheme() {
	const media = useMemo(() => window.matchMedia('(prefers-color-scheme: dark)'), []);
	const [match, setMatch] = useState(media.matches);
	useEffect(() => {
		const cb = ({matches}: MediaQueryListEvent) => {
			setMatch(matches);
		};

		const media = window.matchMedia('(prefers-color-scheme: dark)');
		media.addEventListener('change', cb);
		return () => {
			media.removeEventListener('change', cb);
		};
	}, []);

	return match ? 'dark' : 'light';
}
