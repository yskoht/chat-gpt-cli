import os from 'os';
import {ulid} from 'ulid';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

import {createFileStorage, STORAGE_NAME} from '@/libraries/zustand/index.js';
import {isFunction} from '@/utilities/index.js';

const MODEL = 'gpt-4';
const INITIAL_CHAT_TITLE = 'New Chat';

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
		title: INITIAL_CHAT_TITLE,
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
	_idList: string[];

	isNewChat: (id: string) => boolean;

	getChat: (id: string) => Chat;
	getMessages: (id: string) => Message[];
	setMessages: (id: string, valueOrSetter: ValueOrSetter) => void;

	getIdList: () => string[];
	moveIdToNext: () => void;
	moveIdToPrev: () => void;

	isInitialTitle: (id: string) => boolean;
	setTitle: (id: string, title: string) => void;
};

const useChatRecord = create<Store>()(
	persist(
		(setStore, getStore) => {
			const _newChat = generateNewChat(MODEL);
			return {
				chatRecord: {},
				id: _newChat.id,
				newChat: _newChat,
				_idList: [] as string[],

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
					setStore(({isNewChat, chatRecord, getChat, _idList}) => {
						const chat = getChat(id);
						const value = isFunction(valueOrSetter)
							? valueOrSetter(chat.messages)
							: valueOrSetter;

						const newChatRecord = {
							...chatRecord,
							[id]: {
								...chat,
								messages: value,
							},
						};

						if (isNewChat(id)) {
							return {
								newChat: generateNewChat(MODEL),
								idList: [id, ..._idList],
								chatRecord: newChatRecord,
							};
						}

						return {
							chatRecord: newChatRecord,
						};
					}),

				getIdList: () => {
					const {chatRecord, _idList} = getStore();
					const keys = Object.keys(chatRecord);
					if (keys.length === _idList.length) {
						return _idList;
					}

					const newIdList = keys.sort().reverse();
					setStore({_idList: newIdList});
					return newIdList;
				},
				// todo: refactoring
				moveIdToNext: () =>
					setStore(({id, isNewChat, newChat, getIdList}) => {
						const idList = getIdList();

						if (isNewChat(id)) {
							const nextId = idList[0];
							if (!nextId) {
								return {};
							}
							return {
								id: nextId,
							};
						}

						const index = idList.indexOf(id);
						if (index === -1) {
							return {};
						}
						const nextIndex = index + 1;
						if (nextIndex === idList.length) {
							return {
								id: newChat.id,
							};
						}
						const nextId = idList[nextIndex];
						if (!nextId) {
							return {};
						}
						return {
							id: nextId,
						};
					}),
				// todo: refactoring
				moveIdToPrev: () =>
					setStore(({id, isNewChat, newChat, getIdList}) => {
						const idList = getIdList();

						if (isNewChat(id)) {
							const prevId = idList[idList.length - 1];
							if (!prevId) {
								return {};
							}
							return {
								id: prevId,
							};
						}

						const index = idList.indexOf(id);
						if (index === -1) {
							return {};
						}
						const prevIndex = index - 1;
						if (prevIndex < 0) {
							return {
								id: newChat.id,
							};
						}
						const prevId = idList[prevIndex];
						if (!prevId) {
							return {};
						}
						return {
							id: prevId,
						};
					}),

				isInitialTitle: (id) =>
					getStore().getChat(id).title === INITIAL_CHAT_TITLE,
				setTitle: (id, title) =>
					setStore(({getChat, isNewChat, chatRecord}) => {
						const chat = getChat(id);
						if (isNewChat(id)) {
							throw new Error(`Cannot set title of new chat: ${id}`);
						}

						return {
							chatRecord: {
								...chatRecord,
								[id]: {
									...chat,
									title,
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
