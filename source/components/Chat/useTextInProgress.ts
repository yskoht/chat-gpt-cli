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

function useTextInProgress(id: string) {
	const store = useStore(({get, set}) => ({get, set}));

	const textInProgress = useMemo(() => store.get(id), [store, id]);

	const setTextInProgress = useCallback(
		(valueOrSetter: ValueOrSetter<string>) => store.set(id, valueOrSetter),
		[store, id],
	);

	const clearTextInProgress = useCallback(
		() => store.set(id, () => ''),
		[store, id],
	);

	return useMemo(
		() => ({
			textInProgress,
			setTextInProgress,
			clearTextInProgress,
		}),
		[textInProgress, setTextInProgress, clearTextInProgress],
	);
}

export default useTextInProgress;
