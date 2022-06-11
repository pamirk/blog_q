import { useRef } from 'react';

export default function useElapsedTime() {
	const ref = useRef( new Date().getTime() );

	const getElapsedTime = () => {
		const time = new Date();
		return time.getTime() - ref.current;
	};

	return getElapsedTime;
}
