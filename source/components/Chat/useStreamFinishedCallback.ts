import {useMemo, useState, useCallback, useEffect} from 'react';

function useStreamFinishedCallback(callback: () => void) {
	const [isStreamFinished, setIsStreamFinished] = useState(false);

	const reset = useCallback(() => setIsStreamFinished(false), []);
	const streamFinished = useCallback(() => setIsStreamFinished(true), []);

	useEffect(() => {
		if (isStreamFinished) {
			reset();
			callback();
		}
	}, [streamFinished, reset, callback, isStreamFinished]);

	return useMemo(() => ({streamFinished}), [streamFinished]);
}

export default useStreamFinishedCallback;
