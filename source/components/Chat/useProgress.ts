import {useState, useCallback, useMemo} from 'react';

function useProgress() {
	const [inProgress, setInProgress] = useState<boolean>(false);
	const start = useCallback(() => setInProgress(true), []);
	const stop = useCallback(() => setInProgress(false), []);

	return useMemo(() => ({inProgress, start, stop}), [inProgress, start, stop]);
}

export default useProgress;
