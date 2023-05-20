import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

import {configPath} from '@/libraries/config.js';
import {createFileStorage, STORAGE_NAME} from '@/libraries/zustand/index.js';

const CONFIG_FILE_NAME = 'config.json';
const CONFIG_FILE_PATH = configPath(CONFIG_FILE_NAME);

export type Model = 'gpt-3.5-turbo' | 'gpt-4';

type Config = {
	chatModel: Model;
	titleModel: Model;
};
type ConfigKey = keyof Config;

type Store = Config & {
	get: <T extends ConfigKey>(key: T) => Config[T];
	set: <T extends ConfigKey>(key: T, value: Config[T]) => void;
};

const useConfig = create<Store>()(
	persist(
		(setStore, getStore) => ({
			chatModel: 'gpt-3.5-turbo',
			titleModel: 'gpt-3.5-turbo',
			get: (key) => getStore()[key],
			set: (key, value) => setStore({[key]: value}),
		}),
		{
			name: STORAGE_NAME.configStorage,
			storage: createJSONStorage(() =>
				createFileStorage<Config>(CONFIG_FILE_PATH),
			),
			partialize: ({chatModel, titleModel}): Config => ({
				chatModel,
				titleModel,
			}),
		},
	),
);

export default useConfig;
