import {useCallback, useMemo} from 'react';

import openai from '@/libraries/openai.js';

export type Message = {
	role: 'system' | 'user' | 'assistant';
	content: string;
};

const SYSTEM_PROMPT = {
	role: 'system',
	content: 'You are a helpful assistant.',
} as const satisfies Message;

type Response = {
	id?: string;
	object?: string;
	created?: number;
	model?: string;
	choices: [
		{
			delta?: {
				content?: string;
			};
			index?: number;
			finish_reason?: string | null;
		},
	];
};

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
	const chat = useCallback(
		async (messages: Message[]) => {
			try {
				const res = await createChatCompletion(messages);

				// @ts-ignore
				res.data.on('data', (data: Buffer) => {
					const lines = toLines(data);
					for (const line of lines) {
						const message = toMessage(line);
						if (isDone(message)) {
							onFinish();
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
		[onChange, onFinish],
	);

	return useMemo(() => ({chat}), [chat]);
}

export default useChat;
