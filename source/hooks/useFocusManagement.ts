import {useInput, useFocusManager} from 'ink';
import {useState, useEffect, useMemo, useCallback} from 'react';

export const FOCUS_ID = {
	chatMessages: 'chatMessages',
	chatUserPrompt: 'chatUserPrompt',
	menu: 'menu',
} as const;

type FocusId = keyof typeof FOCUS_ID;

const FOCUS_ORDER: FocusId[] = [
	FOCUS_ID.chatUserPrompt,
	FOCUS_ID.chatMessages,
	FOCUS_ID.menu,
];

function isInvalidFocusIndex(index: number): boolean {
	return index < 0 || index >= FOCUS_ORDER.length;
}

function nextIndex(index: number): number {
	return (index + 1) % FOCUS_ORDER.length;
}

function previousIndex(index: number): number {
	return (index - 1 + FOCUS_ORDER.length) % FOCUS_ORDER.length;
}

function useFocusManagement() {
	const {focus, disableFocus} = useFocusManager();
	const [currentFocusIndex, setCurrentFocusIndex] = useState<number>(0);

	const currentFocus = useMemo(() => {
		if (isInvalidFocusIndex(currentFocusIndex)) {
			throw new Error('Invalid focus index');
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return FOCUS_ORDER[currentFocusIndex]!;
	}, [currentFocusIndex]);

	useEffect(() => {
		disableFocus();
	}, [disableFocus]);

	useEffect(() => {
		focus(currentFocus);
	}, [focus, currentFocus]);

	const focusNext = useCallback(() => {
		setCurrentFocusIndex(nextIndex);
	}, []);
	const focusPrevious = useCallback(() => {
		setCurrentFocusIndex(previousIndex);
	}, []);

	useInput((_, key) => {
		if (key.shift && key.tab) {
			focusPrevious();
			return;
		}
		if (key.tab) {
			focusNext();
			return;
		}
	});
}

export default useFocusManagement;
