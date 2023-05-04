import {useState, useCallback, useMemo} from 'react';

const INIT_HISTORY = [''];
const INIT_INDEX = 0;

function excludeFirstItem<T>(list: T[]): T[] {
	return list.slice(1);
}

function alreadyExistsInHistory(history: string[], text: string): boolean {
	return history.includes(text);
}

function useInputHistory() {
	const [history, setHistory] = useState<string[]>(INIT_HISTORY);
	const [index, setIndex] = useState<number>(INIT_INDEX);

	const resetIndex = useCallback(() => setIndex(INIT_INDEX), []);

	const updateHistory = useCallback(
		(text: string) => {
			const _history = excludeFirstItem(history);
			if (!alreadyExistsInHistory(_history, text)) {
				setHistory([...INIT_HISTORY, text, ..._history]);
			}
			resetIndex();
		},
		[history, resetIndex],
	);

	const getPrevHistory = useCallback(
		(text: string): string | null => {
			const nextIndex = index + 1;
			if (nextIndex >= history.length) {
				return null;
			}
			if (index === 0) {
				setHistory(([, ...xs]) => [text, ...xs]);
			}
			setIndex(nextIndex);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return history[nextIndex]!;
		},
		[history, index],
	);

	const getNextHistory = useCallback(() => {
		const nextIndex = index - 1;
		if (nextIndex < 0) {
			return null;
		}
		setIndex(nextIndex);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return history[nextIndex]!;
	}, [history, index]);

	return useMemo(
		() => ({
			updateHistory,
			getPrevHistory,
			getNextHistory,
		}),
		[updateHistory, getPrevHistory, getNextHistory],
	);
}

export default useInputHistory;
