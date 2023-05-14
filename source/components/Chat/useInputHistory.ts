import {useState, useCallback, useMemo} from 'react';

import {Cursor} from '@/components/MultiLineTextInput/index.js';
import useHistory from '@/hooks/useHistory.js';
import {isNullable} from '@/utilities/index.js';

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

function useIndex(initIndex: number) {
	const [index, setIndex] = useState<number>(initIndex);
	const resetIndex = useCallback(() => setIndex(initIndex), [initIndex]);
	return useMemo(
		() => ({index, setIndex, resetIndex}),
		[index, setIndex, resetIndex],
	);
}

function useInputHistory() {
	const {history, save, saveTemporarily} = useHistory();
	const {index, setIndex, resetIndex} = useIndex(0);

	const updateHistory = useCallback(
		(text: string) => {
			save(text);
			resetIndex();
		},
		[save, resetIndex],
	);

	const getPrevHistory = useCallback(
		(text: string): string | null => {
			if (index === 0) {
				saveTemporarily(text);
			}

			const nextIndex = index + 1;
			if (nextIndex >= history.length) {
				return null;
			}
			setIndex(nextIndex);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return history[nextIndex]!;
		},
		[index, setIndex, history, saveTemporarily],
	);

	const getNextHistory = useCallback((): string | null => {
		const nextIndex = index - 1;
		if (nextIndex < 0) {
			return null;
		}
		setIndex(nextIndex);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return history[nextIndex]!;
	}, [index, setIndex, history]);

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
