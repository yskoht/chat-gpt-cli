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
	const messagesLineCount = useMemo(() => {
		return messages.reduce((acc, message) => {
			return acc + toLines(message.content).length;
		}, 0);
	}, [messages]);

	const textInProgressLineCount = useMemo(() => {
		return toLines(textInProgress).length;
	}, [textInProgress]);

	const userPromptTextLineCount = useMemo(() => {
		return toLines(userPromptText).length;
	}, [userPromptText]);

	console.log({
		messagesLineCount,
		textInProgressLineCount,
		userPromptTextLineCount,
	});

	useEffect(() => {
		recalculateComponentSize();
		scrollToBottom();
	}, [
		messagesLineCount,
		textInProgressLineCount,
		userPromptTextLineCount,
		recalculateComponentSize,
		scrollToBottom,
	]);
}

export default useAutoScroll;
