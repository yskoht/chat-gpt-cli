import {useState, useCallback, useMemo} from 'react';

const INIT = '';

function useMessage() {
	const [message, setMessage] = useState<string>(INIT);
	const clearMessage = useCallback(() => setMessage(INIT), []);
	return useMemo(
		() => [message, setMessage, clearMessage] as const,
		[message, setMessage, clearMessage],
	);
}

export default useMessage;
