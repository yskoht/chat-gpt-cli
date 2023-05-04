import {useMemo, useEffect} from 'react';

import {toLines} from '@/utilities/index.js';

import useScrollArea from '../ScrollArea/useScrollArea.js';
import {Message as MessageType} from './types.js';

type Props = {
	messages: MessageType[];
	textInProgress: string;
	userPromptText: string;
};
function useAutoScroll({messages, textInProgress, userPromptText}: Props) {
	const {scrollToBottom, recalculateComponentSize} = useScrollArea();
	const messagesLength = useMemo(() => {
		return messages.length;
	}, [messages]);

	const userPromptTextLineCount = useMemo(() => {
		return toLines(userPromptText).length;
	}, [userPromptText]);

	useEffect(() => {
		recalculateComponentSize();
		scrollToBottom();
	}, [
		messagesLength,
		textInProgress,
		userPromptTextLineCount,
		recalculateComponentSize,
		scrollToBottom,
	]);
}

export default useAutoScroll;
