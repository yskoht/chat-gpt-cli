import {useMemo, useCallback} from 'react';
import {create} from 'zustand';

import {isFunction} from '@/utilities/index.js';

type Setter<T> = (text: T) => T;
type ValueOrSetter<T> = T | Setter<T>;

type Store = {
	textInProcess: {
		[id: string]: string;
	};
	get: (id: string) => string;
	set: (id: string, valueOrSetter: ValueOrSetter<string>) => void;
};

const useStore = create<Store>()((setStore, getStore) => ({
	textInProcess: {},
	get: (id) => getStore().textInProcess[id] || '',
	set: (id, valueOrSetter) =>
		setStore(({textInProcess}) => {
			const value = isFunction(valueOrSetter)
				? valueOrSetter(textInProcess[id] || '')
				: valueOrSetter;
			return {
				textInProcess: {
					...textInProcess,
					[id]: value,
				},
			};
		}),
}));

function useTextInProgress() {
	const store = useStore(({get, set}) => ({get, set}));

	const getTextInProgress = useCallback((id: string) => store.get(id), [store]);

	const setTextInProgress = useCallback(
		(id: string, valueOrSetter: ValueOrSetter<string>) =>
			store.set(id, valueOrSetter),
		[store],
	);

	const clearTextInProgress = useCallback(
		(id: string) => store.set(id, () => ''),
		[store],
	);

	return useMemo(
		() => ({
			getTextInProgress,
			setTextInProgress,
			clearTextInProgress,
		}),
		[getTextInProgress, setTextInProgress, clearTextInProgress],
	);
}

export default useTextInProgress;
