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
import {ROLE} from './hooks/constants.js';
import {markColor} from './Mark.js';

function finishTextInProgress(textInProgress: string) {
	return textInProgress.trimEnd() + LINE_SEP;
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
		const t = finishTextInProgress(textInProgress);
		setMessages(x => [...x, assistantMessage(t)]);
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
	const {submitChat} = useChat({onChange, onFinish});

	const onSubmit = useCallback(async () => {
		startLoading();
		const _userMessage = userMessage(userPromptText);
		const _messages = [...messages, _userMessage];
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
