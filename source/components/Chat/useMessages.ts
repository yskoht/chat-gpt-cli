import {useMemo, useCallback} from 'react';

import useChatRecord, {ValueOrSetter} from '@/hooks/useChatRecord.js';

function useMessages(id: string) {
	const chatRecord = useChatRecord(({getMessages, setMessages, setTitle}) => ({
		getMessages,
		setMessages,
		setTitle,
	}));

	const messages = useMemo(() => chatRecord.getMessages(id), [chatRecord, id]);
	const setMessages = useCallback(
		(valueOrSetter: ValueOrSetter) => chatRecord.setMessages(id, valueOrSetter),
		[chatRecord, id],
	);
	const setTitle = useCallback(
		(title: string) => chatRecord.setTitle(id, title),
		[chatRecord, id],
	);

	return useMemo(
		() => ({
			messages,
			setMessages,
			setTitle,
		}),
		[messages, setMessages, setTitle],
	);
}

export default useMessages;
