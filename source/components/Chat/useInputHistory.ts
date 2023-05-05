import {useState, useCallback, useMemo} from 'react';

import {Cursor} from '@/components/MultiLineTextInput/index.js';
import {isNullable} from '@/utilities/index.js';

const INIT_HISTORY = [''];
const INIT_INDEX = 0;

function excludeFirstItem<T>(list: T[]): T[] {
	return list.slice(1);
}

function alreadyExistsInHistory(history: string[], text: string): boolean {
	return history.includes(text);
}

type GetPrevHistory = () => string | null;
type GetNextHistory = () => string | null;
type Operator = GetPrevHistory | GetNextHistory;
function onHistory(cursor: Cursor, value: string, operator: Operator) {
	const nextValue = operator();
	if (isNullable(nextValue)) {
		return {
			nextCursor: cursor,
			nextValue: value,
		};
	}
	return {
		nextCursor: 0,
		nextValue,
	};
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

	const getNextHistory = useCallback((): string | null => {
		const nextIndex = index - 1;
		if (nextIndex < 0) {
			return null;
		}
		setIndex(nextIndex);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return history[nextIndex]!;
	}, [history, index]);

	const onHistoryPrev = useCallback(
		(cursor: Cursor, value: string) => {
			const operator: GetPrevHistory = () => getPrevHistory(value);
			return onHistory(cursor, value, operator);
		},
		[getPrevHistory],
	);

	const onHistoryNext = useCallback(
		(cursor: Cursor, value: string) => {
			const operator: GetNextHistory = () => getNextHistory();
			return onHistory(cursor, value, operator);
		},
		[getNextHistory],
	);

	return useMemo(
		() => ({
			updateHistory,
			onHistoryNext,
			onHistoryPrev,
		}),
		[updateHistory, onHistoryNext, onHistoryPrev],
	);
}

export default useInputHistory;
