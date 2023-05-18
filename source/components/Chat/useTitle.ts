// import {useMemo, useCallback} from 'react';
import {useCallback, useMemo} from 'react';

import useChatRecord, {Message} from '@/hooks/useChatRecord.js';

import log from './log.js';
import useChat, {userMessage} from './useChat.js';

const UNTITLED = 'Untitled';

function createPrompt(messages: Message[]): Message[] {
	const m = messages.find((message) => message.role === 'user')?.content;
	if (!m) {
		log().error({messages}, 'No user message found');
	}

	const prompt = `
		Below is the prompt entered into ChatGPT.
		Please create an appropriate title that represents this prompt with 20 ~ 30 characters.
		Output only the title, no quotes, etc.

		${m}
	`;

	return [userMessage(prompt)];
}

function createTitle(content: string) {
	return (
		content
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean)[0] || UNTITLED
	);
}

function useTitle(id: string) {
	const chatRecord = useChatRecord(({isInitialTitle, setTitle}) => ({
		isInitialTitle,
		setTitle,
	}));

	const shouldCreateTitle = useCallback(
		() => chatRecord.isInitialTitle(id),
		[id, chatRecord],
	);

	const onChange = useCallback(
		(content: string) => {
			const title = createTitle(content);
			chatRecord.setTitle(id, title);
		},
		[id, chatRecord],
	);

	const {submitChat} = useChat({
		onChange,
	});

	const generateTitle = useCallback(
		(messages: Message[]) => {
			chatRecord.setTitle(id, 'Creating title...');
			const prompt = createPrompt(messages);
			// memo: not using await
			submitChat(prompt);
		},
		[id, chatRecord, submitChat],
	);

	return useMemo(
		() => ({
			shouldCreateTitle,
			generateTitle,
		}),
		[shouldCreateTitle, generateTitle],
	);
}

export default useTitle;
