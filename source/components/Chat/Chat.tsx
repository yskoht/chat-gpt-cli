import {Text, Box, useFocus} from 'ink';
import Spinner from 'ink-spinner';
import React, {useMemo, useCallback} from 'react';

import Divider from '@/components/Divider/index.js';
import ScrollArea from '@/components/ScrollArea/index.js';
import {Message as MessageType} from '@/hooks/useChatRecord.js';
import {FOCUS_ID} from '@/hooks/useFocusManagement.js';
import * as styles from '@/styles/index.js';
import {SPACE, replaceLineSep} from '@/utilities/index.js';

import {markColor} from './Mark.js';
import Message from './Message.js';
import UserPrompt from './UserPrompt.js';
import {chatScrollHandler} from './chatScrollHandler.js';
import {MESSAGE_MARK, USER_PROMPT_MARK} from './constants.js';
import useAutoScroll from './useAutoScroll.js';
import useChat, {assistantMessage, userMessage} from './useChat.js';
import useInputHistory from './useInputHistory.js';
import useMessages from './useMessages.js';
import useStreamFinishedCallback from './useStreamFinishedCallback.js';
import useText from './useText.js';
import useTextInProgress from './useTextInProgress.js';

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
	inWaiting: boolean;
	isFocused: boolean;
};
function ChatMessages({
	messages,
	textInProgress,
	userPromptText,
	inWaiting,
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
			{inWaiting && _textInProgress}
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
	inWaiting: boolean;
	isFocused: boolean;
};
function ChatUserPrompt({
	messages,
	setMessages,
	userPromptText,
	setUserPromptText,
	clearUserPromptText,
	submitChat,
	inWaiting,
	isFocused,
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

	const _userPrompt = useMemo(() => {
		const markColor = styles.getFocusColor(isFocused);
		return (
			<UserPrompt
				value={userPromptText}
				mark={USER_PROMPT_MARK}
				markColor={markColor}
				onChange={setUserPromptText}
				onSubmit={onSubmit}
				showCursor
				isActive={isFocused}
				onHistoryPrev={onHistoryPrev}
				onHistoryNext={onHistoryNext}
			/>
		);
	}, [
		userPromptText,
		setUserPromptText,
		onSubmit,
		onHistoryPrev,
		onHistoryNext,
		isFocused,
	]);

	if (inWaiting) {
		return <Spinner />;
	}

	return <Box>{_userPrompt}</Box>;
}

type ChatMessagesContainerProps = Omit<ChatMessagesProps, 'isFocused'>;
function ChatMessagesContainer(props: ChatMessagesContainerProps) {
	const {isFocused} = useFocus({id: FOCUS_ID.chatMessages});
	const scrollBarVisibility = useMemo(
		() => (isFocused ? 'visible' : 'auto'),
		[isFocused],
	);
	const scrollBarColor = useMemo(
		() => styles.getFocusColor(isFocused),
		[isFocused],
	);

	const content = useMemo(() => {
		if (props.messages.length === 0) {
			// memo: to show the scroll bar when the chat is empty
			return <Text>{SPACE}</Text>;
		}
		return <ChatMessages {...props} isFocused={isFocused} />;
	}, [props, isFocused]);

	return (
		<Box height="100%">
			<ScrollArea
				isActive={isFocused}
				scrollHandler={chatScrollHandler}
				scrollBarVisibility={scrollBarVisibility}
				scrollBarColor={scrollBarColor}
			>
				{content}
			</ScrollArea>
		</Box>
	);
}

type ChatUserPromptContainerProps = Omit<ChatUserPromptProps, 'isFocused'>;
function ChatUserPromptContainer(props: ChatUserPromptContainerProps) {
	const {isFocused} = useFocus({id: FOCUS_ID.chatUserPrompt});
	return <ChatUserPrompt {...props} isFocused={isFocused} />;
}

type Props = {
	id: string;
};
function Chat({id}: Props) {
	const {messages, setMessages} = useMessages(id);
	const {textInProgress, setTextInProgress, clearTextInProgress} =
		useTextInProgress(id);
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
	const {submitChatStream, inWaiting} = useChat({
		onChange,
		onFinish: streamFinished,
	});

	return (
		<Box
			flexDirection="column"
			justifyContent="space-between"
			borderStyle="single"
			paddingLeft={1}
			paddingRight={1}
		>
			<ChatMessagesContainer
				messages={messages}
				textInProgress={textInProgress}
				userPromptText={userPromptText}
				inWaiting={inWaiting}
			/>
			<Divider />
			<ChatUserPromptContainer
				messages={messages}
				setMessages={setMessages}
				userPromptText={userPromptText}
				setUserPromptText={setUserPromptText}
				clearUserPromptText={clearUserPromptText}
				submitChat={submitChatStream}
				inWaiting={inWaiting}
			/>
		</Box>
	);
}

export default Chat;
