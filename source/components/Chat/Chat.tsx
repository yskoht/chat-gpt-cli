import {Box, useFocus} from 'ink';
import Spinner from 'ink-spinner';
import React, {useMemo, useCallback} from 'react';

import Divider from '@/components/Divider/index.js';
import ScrollArea from '@/components/ScrollArea/index.js';
import {Message as MessageType} from '@/hooks/useChatRecord.js';
import useChatRecord from '@/hooks/useChatRecord.js';
import useConfig from '@/hooks/useConfig.js';
import {FOCUS_ID} from '@/hooks/useFocusManagement.js';
import * as styles from '@/styles/index.js';
import {replaceLineSep} from '@/utilities/index.js';

import {markColor} from './Mark.js';
import Message from './Message.js';
import UserPrompt from './UserPrompt.js';
import {chatScrollHandler} from './chatScrollHandler.js';
import {MESSAGE_MARK, USER_PROMPT_MARK} from './constants.js';
import useAutoScroll from './useAutoScroll.js';
import useChat, {assistantMessage, userMessage} from './useChat.js';
import useInputHistory from './useInputHistory.js';
import useText from './useText.js';
import useTextInProgress from './useTextInProgress.js';
import useTitle from './useTitle.js';

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
};
function _ChatMessages({
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
			{inWaiting && textInProgress && _textInProgress}
		</Box>
	);
}
const ChatMessages = React.memo(_ChatMessages);

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
function _ChatUserPrompt({
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
const ChatUserPrompt = React.memo(_ChatUserPrompt);

type Props = {
	id: string;
};
function Chat({id}: Props) {
	const {isFocused} = useFocus({id: FOCUS_ID.chat});
	const borderColor = useMemo(
		() => styles.getFocusColor(isFocused),
		[isFocused],
	);

	const {getMessages, setMessages} = useChatRecord(
		({getMessages, setMessages}) => ({
			getMessages,
			setMessages,
		}),
	);

	const {getTextInProgress, setTextInProgress, clearTextInProgress} =
		useTextInProgress();
	const [userPromptText, setUserPromptText, clearUserPromptText] = useText();
	const {shouldCreateTitle, generateTitle} = useTitle(id);

	const config = useConfig();
	const model = config.get('chatModel');

	const onChange = useCallback(
		(content: string) => {
			setTextInProgress(id, (x) => x + replaceLineSep(content));
		},
		[setTextInProgress, id],
	);
	const onFinish = useCallback(() => {
		const messages = getMessages(id);
		const textInProgress = getTextInProgress(id);

		const t = finishTextInProgress(textInProgress);
		const _messages = [...messages, assistantMessage(t)];
		if (shouldCreateTitle()) {
			generateTitle(_messages);
		}
		setMessages(id, _messages);
		clearTextInProgress(id);
	}, [
		id,
		getTextInProgress,
		getMessages,
		setMessages,
		shouldCreateTitle,
		generateTitle,
		clearTextInProgress,
	]);
	const {submitChatStream, inWaiting} = useChat({
		model,
		onChange,
		onFinish,
	});

	const messages = getMessages(id);
	const textInProgress = getTextInProgress(id);
	const _setMessages = useCallback(
		(messages: MessageType[]) => setMessages(id, messages),
		[id, setMessages],
	);

	return (
		<Box
			flexDirection="column"
			justifyContent="space-between"
			borderStyle="single"
			paddingLeft={1}
			paddingRight={1}
			borderColor={borderColor}
		>
			<Box height="100%">
				<ScrollArea scrollHandler={chatScrollHandler}>
					<ChatMessages
						messages={messages}
						textInProgress={textInProgress}
						userPromptText={userPromptText}
						inWaiting={inWaiting}
					/>
				</ScrollArea>
			</Box>

			<Divider />

			<ChatUserPrompt
				messages={messages}
				setMessages={_setMessages}
				userPromptText={userPromptText}
				setUserPromptText={setUserPromptText}
				clearUserPromptText={clearUserPromptText}
				submitChat={submitChatStream}
				inWaiting={inWaiting}
				isFocused={isFocused}
			/>
		</Box>
	);
}

export default React.memo(Chat);
