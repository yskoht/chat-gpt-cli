import Logger from 'bunyan';
import {createStore, StoreApi} from 'zustand/vanilla';

import {createLogger} from '@/libraries/logger.js';
import {nop} from '@/utilities/index.js';

type StoreCore = {
	logger: Logger;
};
export type Store = StoreApi<StoreCore>;

const store = (debug: boolean) =>
	createStore<StoreCore>(() => ({
		// @ts-ignore
		logger: debug ? createLogger() : nop,
	}));

export default store;
