import {useCallback, useMemo} from 'react';

import openai from '@/libraries/openai.js';

import {ROLE} from './constants.js';
import {Message, Response} from './types.js';
import useProgress from './useProgress.js';

const SYSTEM_PROMPT = {
	role: ROLE.system,
	content: 'You are a helpful assistant.',
} as const satisfies Message;

const MODEL = 'gpt-4';
async function createChatCompletion(messages: Message[]) {
	return await openai.createChatCompletion(
		{
			model: MODEL,
			messages: [SYSTEM_PROMPT, ...messages],
			stream: true,
		},
		{responseType: 'stream'},
	);
}

function isNotEmptyLine(line: string) {
	return line.trim() !== '';
}

function toLines(data: Buffer) {
	return data.toString().split('\n').filter(isNotEmptyLine);
}

function toMessage(line: string) {
	return line.replace(/^data: /, '');
}

function isDone(message: string) {
	return message === '[DONE]';
}

function getContent(message: string) {
	try {
		const response = JSON.parse(message) as Response;
		const content = response.choices[0]?.delta?.content;
		return content;
	} catch (error: unknown) {
		console.error('JSON parse failure', message, error);
		return undefined;
	}
}

type Props = {
	onChange: (content: string) => void;
	onFinish: () => void;
};
function useChat({onChange, onFinish}: Props) {
	const streaming = useProgress();

	const submitChat = useCallback(
		async (messages: Message[]) => {
			streaming.start();
			try {
				const res = await createChatCompletion(messages);

				// @ts-ignore
				res.data.on('data', (data: Buffer) => {
					const lines = toLines(data);
					for (const line of lines) {
						const message = toMessage(line);
						if (isDone(message)) {
							onFinish();
							streaming.stop();
							return;
						}

						const content = getContent(message);
						if (content) {
							onChange(content);
						}
					}
				});
			} catch (error: unknown) {
				console.error(error);
			}
		},
		[onChange, onFinish, streaming],
	);

	return useMemo(
		() => ({
			inStreaming: streaming.inProgress,
			submitChat,
		}),
		[streaming.inProgress, submitChat],
	);
}

export default useChat;
