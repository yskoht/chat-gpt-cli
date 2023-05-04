import {Newline, Box} from 'ink';
import Spinner from 'ink-spinner';
import React, {useMemo, useState, useCallback} from 'react';

import {Cursor} from '@/components/MultiLineTextInput/index.js';
import {isNullable, LINE_SEP, replaceLineSep} from '@/utilities/index.js';

import {markColor} from './Mark.js';
import Message from './Message.js';
import {ROLE, MESSAGE_MARK, USER_PROMPT_MARK} from './constants.js';
import {Message as MessageType} from './types.js';
import useAutoScroll from './useAutoScroll.js';
import useChat from './useChat.js';
import useInputHistory from './useInputHistory.js';
import useStreamFinishedCallback from './useStreamFinishedCallback.js';
import useText from './useText.js';

function finishTextInProgress(textInProgress: string) {
	return textInProgress.trimEnd() + LINE_SEP;
}

function keyExtractor(text: string, index: number): string {
	return `${index}-${text}`;
}

function Chat() {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [textInProgress, setTextInProgress, clearTextInProgress] = useText();
	const [userPromptText, setUserPromptText, clearUserPromptText] = useText();
	const {updateHistory, getPrevHistory, getNextHistory} = useInputHistory();
	useAutoScroll({messages, textInProgress, userPromptText});

	const assistantMessage = useCallback(
		(text: string) => ({role: ROLE.assistant, content: text}),
		[],
	);
	const userMessage = useCallback(
		(text: string) => ({role: ROLE.user, content: text}),
		[],
	);

	const streamFinishedCallback = useCallback(() => {
		const t = finishTextInProgress(textInProgress);
		setMessages((x) => [...x, assistantMessage(t)]);
		clearTextInProgress();
	}, [textInProgress, assistantMessage, setMessages, clearTextInProgress]);
	const {streamFinished} = useStreamFinishedCallback(streamFinishedCallback);

	const onChange = useCallback(
		(content: string) => {
			setTextInProgress((x) => x + replaceLineSep(content));
		},
		[setTextInProgress],
	);
	const onFinish = useCallback(() => {
		streamFinished();
	}, [streamFinished]);
	const {submitChat, inStreaming} = useChat({onChange, onFinish});

	const onSubmit = useCallback(async () => {
		updateHistory(userPromptText);
		const _messages = [...messages, userMessage(userPromptText)];
		setMessages(_messages);
		clearUserPromptText();
		await submitChat(_messages);
	}, [
		submitChat,
		userPromptText,
		userMessage,
		messages,
		setMessages,
		clearUserPromptText,
		updateHistory,
	]);

	const onHistoryPrev = useCallback(
		(cursor: Cursor, value: string) => {
			const nextValue = getPrevHistory(value);
			if (isNullable(nextValue)) {
				return {
					nextCursor: cursor,
					nextValue: value,
				};
			}
			return {
				nextCursor: 0,
				nextValue,
			};
		},
		[getPrevHistory],
	);

	const onHistoryNext = useCallback(
		(cursor: Cursor, value: string) => {
			const nextValue = getNextHistory();
			if (isNullable(nextValue)) {
				return {
					nextCursor: cursor,
					nextValue: value,
				};
			}
			return {
				nextCursor: 0,
				nextValue,
			};
		},
		[getNextHistory],
	);

	const _messages = useMemo(
		() =>
			messages.map((message, i) => {
				const _markColor = markColor(message);
				const key = keyExtractor(message.content, i);
				return (
					<Box key={key}>
						<Message
							value={message.content}
							mark={MESSAGE_MARK}
							markColor={_markColor}
						/>
						<Newline />
					</Box>
				);
			}),
		[messages],
	);

	const _textInProgress = useMemo(
		() => <Message value={textInProgress} mark={<Spinner />} />,
		[textInProgress],
	);

	const _userPrompt = useMemo(
		() => (
			<Message
				value={userPromptText}
				mark={USER_PROMPT_MARK}
				onChange={setUserPromptText}
				onSubmit={onSubmit}
				showCursor
				isActive
				onHistoryPrev={onHistoryPrev}
				onHistoryNext={onHistoryNext}
				enableSyntaxHighlight={false}
			/>
		),
		[userPromptText, setUserPromptText, onSubmit, onHistoryPrev, onHistoryNext],
	);

	return (
		<Box flexDirection="column" justifyContent="flex-end">
			{_messages}
			{inStreaming && _textInProgress}
			{!inStreaming && _userPrompt}
		</Box>
	);
}

export default Chat;
