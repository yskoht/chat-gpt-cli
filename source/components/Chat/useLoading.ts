import {useState, useCallback, useMemo} from 'react';

function useLoading() {
	const [loading, setLoading] = useState<boolean>(false);

	const startLoading = useCallback(() => setLoading(true), []);
	const stopLoading = useCallback(() => setLoading(false), []);
	return useMemo(
		() => ({
			loading,
			startLoading,
			stopLoading,
		}),
		[loading, startLoading, stopLoading],
	);
}

export default useLoading;
