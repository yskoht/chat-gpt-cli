import {Box, useFocus} from 'ink';
import Spinner from 'ink-spinner';
import React, {useMemo, useState, useCallback} from 'react';

import '@/components/Markdown/index.js';
import ScrollArea from '@/components/ScrollArea/index.js';
import {replaceLineSep} from '@/utilities/index.js';

import {markColor} from './Mark.js';
import Message from './Message.js';
import UserPrompt from './UserPrompt.js';
import {MESSAGE_MARK, USER_PROMPT_MARK} from './constants.js';
import {Message as MessageType} from './types.js';
import useAutoScroll from './useAutoScroll.js';
import useChat, {assistantMessage, userMessage} from './useChat.js';
import useInputHistory from './useInputHistory.js';
import useStreamFinishedCallback from './useStreamFinishedCallback.js';
import useText from './useText.js';

function finishTextInProgress(textInProgress: string) {
	return textInProgress.trimEnd();
}

function keyExtractor(text: string, index: number): string {
	return `${index}-${text}`;
}

type ChatMessagesProps = {
	messages: MessageType[];
	textInProgress: string;
	userPromptText: string;
	inStreaming: boolean;
};
function ChatMessages({
	messages,
	textInProgress,
	userPromptText,
	inStreaming,
}: ChatMessagesProps) {
	useAutoScroll({messages, textInProgress, userPromptText});

	const _messages = useMemo(
		() =>
			messages.map((message, i) => {
				const _markColor = markColor(message);
				const key = keyExtractor(message.content, i);
				return (
					<Box key={key} marginBottom={1}>
						<Message
							value={message.content}
							mark={MESSAGE_MARK}
							markColor={_markColor}
							enableTabulation
						/>
					</Box>
				);
			}),
		[messages],
	);

	const _textInProgress = useMemo(
		() => (
			<Message
				value={textInProgress}
				mark={MESSAGE_MARK}
				enableTabulation={false}
			/>
		),
		[textInProgress],
	);

	return (
		<Box flexDirection="column">
			{_messages}
			{inStreaming && _textInProgress}
		</Box>
	);
}

type ChatUserPromptProps = {
	messages: MessageType[];
	setMessages: (messages: MessageType[]) => void;
	userPromptText: string;
	setUserPromptText: (text: string) => void;
	clearUserPromptText: () => void;
	submitChat: (messages: MessageType[]) => Promise<void>;
	inStreaming: boolean;
};
function ChatUserPrompt({
	messages,
	setMessages,
	userPromptText,
	setUserPromptText,
	clearUserPromptText,
	submitChat,
	inStreaming,
}: ChatUserPromptProps) {
	const {updateHistory, onHistoryPrev, onHistoryNext} = useInputHistory();

	const onSubmit = useCallback(async () => {
		updateHistory(userPromptText);
		const _messages = [...messages, userMessage(userPromptText)];
		setMessages(_messages);
		clearUserPromptText();
		await submitChat(_messages);
	}, [
		submitChat,
		userPromptText,
		messages,
		setMessages,
		clearUserPromptText,
		updateHistory,
	]);

	const _userPrompt = useMemo(
		() => (
			<UserPrompt
				value={userPromptText}
				mark={USER_PROMPT_MARK}
				onChange={setUserPromptText}
				onSubmit={onSubmit}
				showCursor
				isActive
				onHistoryPrev={onHistoryPrev}
				onHistoryNext={onHistoryNext}
			/>
		),
		[userPromptText, setUserPromptText, onSubmit, onHistoryPrev, onHistoryNext],
	);

	if (inStreaming) {
		return <Spinner />;
	}

	return <Box>{_userPrompt}</Box>;
}

function ChatMessagesContainer(props: ChatMessagesProps) {
	useFocus();
	return (
		<Box borderStyle="single" height="100%" paddingLeft={1} paddingRight={1}>
			<ScrollArea>
				<ChatMessages {...props} />
			</ScrollArea>
		</Box>
	);
}

function ChatUserPromptContainer(props: ChatUserPromptProps) {
	useFocus();
	return (
		<Box borderStyle="single" paddingLeft={1} paddingRight={1}>
			<ChatUserPrompt {...props} />
		</Box>
	);
}

function Chat() {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [textInProgress, setTextInProgress, clearTextInProgress] = useText();
	const [userPromptText, setUserPromptText, clearUserPromptText] = useText();

	const onChange = useCallback(
		(content: string) => {
			setTextInProgress((x) => x + replaceLineSep(content));
		},
		[setTextInProgress],
	);
	const streamFinishedCallback = useCallback(() => {
		const t = finishTextInProgress(textInProgress);
		setMessages((x) => [...x, assistantMessage(t)]);
		clearTextInProgress();
	}, [textInProgress, setMessages, clearTextInProgress]);
	const {streamFinished} = useStreamFinishedCallback(streamFinishedCallback);
	const {submitChat, inStreaming} = useChat({
		onChange,
		onFinish: streamFinished,
	});

	return (
		<Box flexDirection="column" justifyContent="space-between">
			<ChatMessagesContainer
				messages={messages}
				textInProgress={textInProgress}
				userPromptText={userPromptText}
				inStreaming={inStreaming}
			/>
			<ChatUserPromptContainer
				messages={messages}
				setMessages={setMessages}
				userPromptText={userPromptText}
				setUserPromptText={setUserPromptText}
				clearUserPromptText={clearUserPromptText}
				submitChat={submitChat}
				inStreaming={inStreaming}
			/>
		</Box>
	);
}

export default Chat;
