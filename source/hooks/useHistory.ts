import os from 'os';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

import {createFileStorage} from '@/libraries/zustand/createFileStorage.js';

const HOME_DIR = os.homedir();
const HISTORY_FILE_NAME = '.chat-gpt-cli-history.json';
const HISTORY_FILE_PATH = `${HOME_DIR}/${HISTORY_FILE_NAME}`;

function excludeFirstItem<T>(list: T[]): T[] {
	return list.slice(1);
}

function alreadyExistsInHistory(history: string[], text: string): boolean {
	return history.includes(text);
}

type PersistedState = {
	history: string[];
};

type StoreCore = PersistedState & {
	save: (text: string) => void;
	saveTemporarily: (text: string) => void;
};

const INIT_HISTORY = [''];
const useHistory = create<StoreCore>()(
	persist(
		(set) => ({
			history: INIT_HISTORY,
			save: (text) =>
				set(({history}) => {
					const _history = excludeFirstItem(history);
					if (alreadyExistsInHistory(_history, text)) {
						return {};
					}
					return {
						history: [...INIT_HISTORY, text, ..._history],
					};
				}),
			saveTemporarily: (text) =>
				set(({history}) => {
					const _history = excludeFirstItem(history);
					return {
						history: [text, ..._history],
					};
				}),
		}),
		{
			name: 'history-storage',
			storage: createJSONStorage(() =>
				createFileStorage<PersistedState>(HISTORY_FILE_PATH),
			),
			partialize: (state): PersistedState => ({history: state.history}),
		},
	),
);

export default useHistory;