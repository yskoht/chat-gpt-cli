import {useMemo, useCallback} from 'react';

import useChatRecord, {ValueOrSetter} from '@/hooks/useChatRecord.js';

function useMessages(id: string) {
	const chatRecord = useChatRecord(({getMessages, setMessages}) => ({
		getMessages,
		setMessages,
	}));

	const messages = useMemo(() => chatRecord.getMessages(id), [chatRecord, id]);
	const setMessages = useCallback(
		(valueOrSetter: ValueOrSetter) => chatRecord.setMessages(id, valueOrSetter),
		[chatRecord, id],
	);

	return useMemo(
		() => ({
			messages,
			setMessages,
		}),
		[messages, setMessages],
	);
}

export default useMessages;
