// import {useMemo, useCallback} from 'react';
import {useCallback, useMemo} from 'react';

import useChatRecord, {Message} from '@/hooks/useChatRecord.js';

import useChat, {userMessage} from './useChat.js';

const UNTITLED = 'Untitled';

function createPrompt(messages: Message[]): Message[] {
	const m = messages.find((message) => message.role === 'user')?.content;
	if (!m) {
		console.error('No user message found');
	}

	const prompt = `
		Below is the prompt entered into ChatGPT.
		Please create an appropriate title that represents this prompt with 10 ~ 20 characters.

		${m}
	`;

	return [userMessage(prompt)];
}

function createTitle(content: string) {
	const t =
		content
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean)[0] || UNTITLED;
	return t.replace(/^('|")|('|")$/g, '');
}

function useTitle(id: string) {
	const chatRecord = useChatRecord(({isInitialTitle, setTitle}) => ({
		isInitialTitle,
		setTitle,
	}));

	const shouldCreateTitle = useMemo(
		() => chatRecord.isInitialTitle(id),
		[chatRecord, id],
	);

	const setTitle = useCallback(
		(title: string) => chatRecord.setTitle(id, title),
		[chatRecord, id],
	);

	const onChange = useCallback(
		(content: string) => {
			const title = createTitle(content);
			setTitle(title);
		},
		[setTitle],
	);

	const {submitChat} = useChat({
		onChange,
	});

	const generateTitle = useCallback(
		(messages: Message[]) => {
			setTitle('Creating title...');
			const prompt = createPrompt(messages);
			// memo: not using await
			submitChat(prompt);
		},
		[setTitle, submitChat],
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
