import React, {useMemo, useState, useCallback} from 'react';
import {Newline, Box, Text} from 'ink';
import Spinner from 'ink-spinner';

import {LINE_SEP} from '../MultiLineTextInput/constants.js';

import Message from './Message.js';
import useMessage from './hooks/useMessage.js';
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

function finishMessageInProgress(messageInProgress: string) {
	return messageInProgress.trimEnd() + LINE_SEP;
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
	const [messageInProgress, setMessageInProgress, clearMessageInProgress] =
		useMessage();
	const [userPrompt, setUserPrompt, clearUserPrompt] = useMessage();
	const {loading, startLoading, stopLoading} = useLoading();

	const assistantMessage = useCallback(
		(m: string) => ({role: ROLE.assistant, content: m}),
		[],
	);
	const userMessage = useCallback(
		(m: string) => ({role: ROLE.user, content: m}),
		[],
	);

	const streamFinishedCallback = useCallback(() => {
		const m = finishMessageInProgress(messageInProgress);
		setMessages(x => [...x, assistantMessage(m)]);
		clearMessageInProgress();
	}, [
		messageInProgress,
		assistantMessage,
		setMessages,
		clearMessageInProgress,
	]);
	const {streamFinished} = useStreamFinishedCallback(streamFinishedCallback);

	const onChange = useCallback(
		(content: string) => setMessageInProgress(x => x + content),
		[setMessageInProgress],
	);
	const onFinish = useCallback(() => {
		streamFinished();
		stopLoading();
	}, [streamFinished, stopLoading]);
	const {chat} = useChat({onChange, onFinish});

	const onSubmit = useCallback(async () => {
		startLoading();
		const _userMessage = userMessage(userPrompt);
		const _messages = [...messages, _userMessage];
		setMessages(_messages);
		clearUserPrompt();
		await chat(_messages);
	}, [
		chat,
		userPrompt,
		userMessage,
		messages,
		setMessages,
		clearUserPrompt,
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

	const _messageInProgress = useMemo(
		() => messageInProgress && <Message value={messageInProgress} mark="■" />,
		[messageInProgress],
	);

	const _userPrompt = useMemo(
		() =>
			loading ? (
				<Text>
					<Spinner />
				</Text>
			) : (
				<Message
					value={userPrompt}
					mark=">"
					onChange={setUserPrompt}
					onSubmit={onSubmit}
					showCursor
					isActive
				/>
			),
		[userPrompt, setUserPrompt, onSubmit, loading],
	);

	return (
		<Box flexDirection="column" justifyContent="flex-end">
			{_messages}
			{_messageInProgress}
			{_userPrompt}
		</Box>
	);
}

export default Chat;
