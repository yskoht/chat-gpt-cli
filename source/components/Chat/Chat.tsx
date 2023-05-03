import React, {useMemo, useState, useCallback} from 'react';
import {Newline, Box} from 'ink';

import {LINE_SEP} from '../MultiLineTextInput/constants.js';

import Message from './Message.js';
import useMessage from './hooks/useMessage.js';
import useStreamFinishedCallback from './hooks/useStreamFinishedCallback.js';
import useChat, {Message as MessageType} from './hooks/useChat.js';

function finishMessageInProgress(messageInProgress: string) {
	return messageInProgress.trimEnd() + LINE_SEP;
}

const USER_MESSAGE_MARK_COLOR = 'blue';
const ASSISTANT_MESSAGE_MARK_COLOR = 'green';
const DEFAULT_MESSAGE_MARK_COLOR = 'gray';

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

	const assistantMessage = useCallback(
		(m: string) => ({role: 'assistant' as const, content: m}),
		[],
	);
	const userMessage = useCallback(
		(m: string) => ({role: 'user' as const, content: m}),
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
	const {chat} = useChat({onChange, onFinish: streamFinished});

	const onSubmit = useCallback(async () => {
		const _userMessage = userMessage(userPrompt);
		const _messages = [...messages, _userMessage];
		setMessages(_messages);
		clearUserPrompt();
		await chat(_messages);
	}, [chat, userPrompt, userMessage, messages, setMessages, clearUserPrompt]);

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
		() =>
			messageInProgress ? (
				<>
					<Message value={messageInProgress} mark="■" />
					<Newline />
				</>
			) : null,
		[messageInProgress],
	);

	const _userPrompt = useMemo(
		() => (
			<Message
				value={userPrompt}
				mark=">"
				onChange={setUserPrompt}
				onSubmit={onSubmit}
				showCursor
				isActive
			/>
		),
		[userPrompt, setUserPrompt, onSubmit],
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
