import {useState, useCallback, useMemo} from 'react';

function useMessage() {
	const [message, setMessage] = useState<string>('');
	const clearMessage = useCallback(() => setMessage(''), []);
	return useMemo(
		() => [message, setMessage, clearMessage] as const,
		[message, setMessage, clearMessage],
	);
}

export default useMessage;
