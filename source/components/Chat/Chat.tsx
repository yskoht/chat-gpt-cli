import React, {useMemo, useState, useCallback} from 'react';
import {Newline, Box, Text} from 'ink';
import Spinner from 'ink-spinner';

import {LINE_SEP} from '../MultiLineTextInput/constants.js';

import Message from './Message.js';
import useText from './hooks/useText.js';
import useLoading from './hooks/useLoading.js';
import useStreamFinishedCallback from './hooks/useStreamFinishedCallback.js';
import useChat from './hooks/useChat.js';
import {Message as MessageType} from './hooks/types.js';
import {
	ROLE,
	USER_MESSAGE_MARK_COLOR,
	ASSISTANT_MESSAGE_MARK_COLOR,
	DEFAULT_MESSAGE_MARK_COLOR,
} from './hooks/constants.js';

function finishTextInProgress(textInProgress: string) {
	return textInProgress.trimEnd() + LINE_SEP;
}

function markColor(message: MessageType) {
	switch (message.role) {
		case 'user':
			return USER_MESSAGE_MARK_COLOR;
		case 'assistant':
			return ASSISTANT_MESSAGE_MARK_COLOR;
		default:
			return DEFAULT_MESSAGE_MARK_COLOR;
	}
}

function Chat() {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [textInProgress, setTextInProgress, clearTextInProgress] = useText();
	const [userPromptText, setUserPromptText, clearUserPromptText] = useText();
	const {loading, startLoading, stopLoading} = useLoading();

	const assistantMessage = useCallback(
		(text: string) => ({role: ROLE.assistant, content: text}),
		[],
	);
	const userMessage = useCallback(
		(text: string) => ({role: ROLE.user, content: text}),
		[],
	);

	const streamFinishedCallback = useCallback(() => {
		const m = finishTextInProgress(textInProgress);
		setMessages(x => [...x, assistantMessage(m)]);
		clearTextInProgress();
	}, [textInProgress, assistantMessage, setMessages, clearTextInProgress]);
	const {streamFinished} = useStreamFinishedCallback(streamFinishedCallback);

	const onChange = useCallback(
		(content: string) => setTextInProgress(x => x + content),
		[setTextInProgress],
	);
	const onFinish = useCallback(() => {
		streamFinished();
		stopLoading();
	}, [streamFinished, stopLoading]);
	const {chat} = useChat({onChange, onFinish});

	const onSubmit = useCallback(async () => {
		startLoading();
		const _userMessage = userMessage(userPromptText);
		const _messages = [...messages, _userMessage];
		setMessages(_messages);
		clearUserPromptText();
		await chat(_messages);
	}, [
		chat,
		userPromptText,
		userMessage,
		messages,
		setMessages,
		clearUserPromptText,
		startLoading,
	]);

	const _messages = useMemo(
		() =>
			messages.map((message, i) => {
				const _markColor = markColor(message);
				return (
					<Box key={`${i}-${message.content}`}>
						<Message value={message.content} mark="■" markColor={_markColor} />
						<Newline />
					</Box>
				);
			}),
		[messages],
	);

	const _textInProgress = useMemo(
		() => textInProgress && <Message value={textInProgress} mark="■" />,
		[textInProgress],
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
					mark=">"
					onChange={setUserPromptText}
					onSubmit={onSubmit}
					showCursor
					isActive
				/>
			),
		[userPromptText, setUserPromptText, onSubmit, loading],
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
