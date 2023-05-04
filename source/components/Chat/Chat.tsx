import {Newline, Box, Text} from 'ink';
import Spinner from 'ink-spinner';
import React, {useMemo, useState, useCallback} from 'react';

import {LINE_SEP, Cursor} from '@/components/MultiLineTextInput/index.js';
import {isNullable} from '@/utilities/index.js';

import {markColor} from './Mark.js';
import Message from './Message.js';
import {ROLE, MESSAGE_MARK, USER_PROMPT_MARK} from './constants.js';
import {Message as MessageType} from './types.js';
import useChat from './useChat.js';
import useInputHistory from './useInputHistory.js';
import useLoading from './useLoading.js';
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
	const {loading, startLoading, stopLoading} = useLoading();
	const {updateHistory, getPrevHistory, getNextHistory} = useInputHistory();

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
		(content: string) => setTextInProgress((x) => x + content),
		[setTextInProgress],
	);
	const onFinish = useCallback(() => {
		streamFinished();
		stopLoading();
	}, [streamFinished, stopLoading]);
	const {submitChat} = useChat({onChange, onFinish});

	const onSubmit = useCallback(async () => {
		startLoading();
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
		startLoading,
		updateHistory,
	]);

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
		() =>
			textInProgress && <Message value={textInProgress} mark={MESSAGE_MARK} />,
		[textInProgress],
	);

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

	const _userPrompt = useMemo(
		() =>
			loading ? (
				<Text>
					<Spinner />
				</Text>
			) : (
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
		[
			userPromptText,
			setUserPromptText,
			onSubmit,
			loading,
			onHistoryPrev,
			onHistoryNext,
		],
	);

	return (
		<Box flexDirection="column" justifyContent="flex-end">
			{_messages}
			{_textInProgress}
			{_userPrompt}
		</Box>
	);
}

export default Chat;
