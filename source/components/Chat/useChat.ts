import {useCallback, useMemo} from 'react';

import {Message, ROLE} from '@/hooks/useChatRecord.js';
import openai, {CreateChatCompletionResponse} from '@/libraries/openai.js';

import log from './log.js';
import {Response} from './types.js';
import useProgress from './useProgress.js';

const SYSTEM_PROMPT = {
	role: ROLE.system,
	content: 'You are a helpful assistant.',
} as const satisfies Message;

const MODEL = 'gpt-4';
type CreateChatCompletionOption = {
	stream: boolean;
};
async function createChatCompletion(
	messages: Message[],
	{stream}: CreateChatCompletionOption,
) {
	return await openai.createChatCompletion(
		{
			model: MODEL,
			messages: [SYSTEM_PROMPT, ...messages],
			...(stream ? {stream: true} : undefined),
		},
		{responseType: stream ? 'stream' : undefined},
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

function getStreamingContent(message: string): string | undefined {
	try {
		const response = JSON.parse(message) as Response;
		const content = response.choices[0]?.delta?.content;
		return content;
	} catch (err: unknown) {
		log().error({message, err}, 'JSON parse failure');
		return undefined;
	}
}

function getContent(data: CreateChatCompletionResponse): string | undefined {
	return data.choices[0]?.message?.content;
}

export function assistantMessage(text: string): Message {
	return {role: ROLE.assistant, content: text};
}

export function userMessage(text: string): Message {
	return {role: ROLE.user, content: text};
}

type Props = {
	onChange: (content: string) => void;
	onFinish?: () => void;
};
function useChat({onChange, onFinish}: Props) {
	const waiting = useProgress();

	const submitChatStream = useCallback(
		async (messages: Message[]) => {
			waiting.start();
			try {
				log().info({messages}, 'submit chat stream');
				const res = await createChatCompletion(messages, {stream: true});

				// @ts-ignore
				res.data.on('data', (data: Buffer) => {
					const lines = toLines(data);
					log().debug({lines}, 'stream data received');

					for (const line of lines) {
						const message = toMessage(line);
						if (isDone(message)) {
							onFinish && onFinish();
							waiting.stop();
							log().info({lines}, 'stream finished');
							return;
						}

						const content = getStreamingContent(message);
						log().debug({content}, 'stream content');
						if (content) {
							onChange(content);
						}
					}
				});
			} catch (err: unknown) {
				log().error({err}, 'submit chat stream failed');
			}
		},
		[onChange, onFinish, waiting],
	);

	const submitChat = useCallback(
		async (messages: Message[]) => {
			waiting.start();
			try {
				log().info({messages}, 'submit chat');
				const res = await createChatCompletion(messages, {stream: false});
				const content = getContent(res.data);
				log().info({content}, 'content');
				if (content) {
					onChange(content);
				}
				onFinish && onFinish();
				waiting.stop();
				log().info('finished');
			} catch (err: unknown) {
				log().error({err}, 'submit chat failed');
			}
		},
		[onChange, onFinish, waiting],
	);

	return useMemo(
		() => ({
			inWaiting: waiting.inProgress,
			submitChatStream,
			submitChat,
		}),
		[waiting.inProgress, submitChatStream, submitChat],
	);
}

export default useChat;
