import os from 'os';
import {ulid} from 'ulid';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

import {createFileStorage, STORAGE_NAME} from '@/libraries/zustand/index.js';
import {isFunction} from '@/utilities/index.js';

const MODEL = 'gpt-4';
const NEW_CHAT_TITLE = 'New Chat';

const HOME_DIR = os.homedir();
const CHAT_RECORD_FILE_NAME = '.chat-gpt-cli-chat-record.json';
const CHAT_RECORD_FILE_PATH = `${HOME_DIR}/${CHAT_RECORD_FILE_NAME}`;

export const ROLE = {
	system: 'system',
	user: 'user',
	assistant: 'assistant',
} as const;
type Role = keyof typeof ROLE;

export type Message = {
	role: Role;
	content: string;
};

type Chat = {
	id: string;
	title: string;
	model: string;
	createdAt: number;
	messages: Message[];
};

function generateId() {
	return ulid();
}

function generateNewChat(model: string): Chat {
	return {
		id: generateId(),
		title: NEW_CHAT_TITLE,
		model,
		createdAt: Date.now(),
		messages: [],
	};
}

type ChatRecord = Record<string, Chat>;
type PersistedState = {
	chatRecord: ChatRecord;
};

type Setter<T> = (text: T) => T;
type _ValueOrSetter<T> = T | Setter<T>;
export type ValueOrSetter = _ValueOrSetter<Message[]>;

type Store = PersistedState & {
	id: string;
	newChat: Chat;
	isNewChat: (id: string) => boolean;
	getChat: (id: string) => Chat;
	getMessages: (id: string) => Message[];
	setMessages: (id: string, valueOrSetter: ValueOrSetter) => void;
};

const useChatRecord = create<Store>()(
	persist(
		(setStore, getStore) => {
			const _newChat = generateNewChat(MODEL);
			return {
				chatRecord: {},
				id: _newChat.id,
				newChat: _newChat,
				isNewChat: (id) => id === getStore().newChat.id,
				getChat: (id) => {
					const {newChat, isNewChat, chatRecord} = getStore();
					const chat = isNewChat(id) ? newChat : chatRecord[id];
					if (!chat) {
						throw new Error(`Chat record not found: ${id}`);
					}
					return chat;
				},
				getMessages: (id) => getStore().getChat(id).messages,
				setMessages: (id, valueOrSetter) =>
					setStore(({isNewChat, newChat, chatRecord, getChat}) => {
						const chat = getChat(id);
						const value = isFunction(valueOrSetter)
							? valueOrSetter(chat.messages)
							: valueOrSetter;

						return {
							newChat: isNewChat(id) ? generateNewChat(MODEL) : newChat,
							chatRecord: {
								...chatRecord,
								[id]: {
									...chat,
									messages: value,
								},
							},
						};
					}),
			};
		},
		{
			name: STORAGE_NAME.chatRecordStorage,
			storage: createJSONStorage(() =>
				createFileStorage<PersistedState>(CHAT_RECORD_FILE_PATH),
			),
			partialize: (state): PersistedState => ({
				chatRecord: state.chatRecord,
			}),
		},
	),
);

export default useChatRecord;
