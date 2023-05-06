import {useMemo, useEffect} from 'react';

import {useScrollArea} from '@/components/ScrollArea/index.js';
import useDimension from '@/hooks/useDimension.js';
import {toLines} from '@/utilities/index.js';

import {Message as MessageType} from './types.js';

type Props = {
	messages: MessageType[];
	textInProgress: string;
	userPromptText: string;
};
function useAutoScroll({messages, textInProgress, userPromptText}: Props) {
	const {width, height} = useDimension();
	const {scrollToBottom, resize} = useScrollArea();
	const messagesLength = useMemo(() => {
		return messages.length;
	}, [messages]);

	const userPromptTextLineCount = useMemo(() => {
		return toLines(userPromptText).length;
	}, [userPromptText]);

	useEffect(resize, [resize, width, height]);

	useEffect(() => {
		resize();
		scrollToBottom();
	}, [
		messagesLength,
		textInProgress,
		userPromptTextLineCount,
		resize,
		scrollToBottom,
	]);
}

export default useAutoScroll;
