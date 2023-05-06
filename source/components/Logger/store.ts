import {createStore, StoreApi} from 'zustand';

import {
	createLogger,
	createStubLogger,
	Logger,
} from '@/libraries/logger/index.js';

type StoreCore = {
	logger: Logger;
};
export type Store = StoreApi<StoreCore>;

const store = (debug: boolean) =>
	createStore<StoreCore>(() => ({
		// @ts-ignore
		logger: debug ? createLogger() : createStubLogger(),
	}));

export default store;
