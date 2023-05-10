import {useInput, useFocusManager} from 'ink';
import {useState, useEffect, useCallback} from 'react';

export const FOCUS_ID = {
	chat: 'chat',
	menu: 'menu',
} as const;
type FocusId = keyof typeof FOCUS_ID;

function useFocusManagement() {
	const {focus, disableFocus} = useFocusManager();
	const [currentFocus, setCurrentFocus] = useState<FocusId>(FOCUS_ID.chat);

	useEffect(() => {
		disableFocus();
	}, [disableFocus]);

	useEffect(() => {
		focus(currentFocus);
	}, [focus, currentFocus]);

	const focusOnChat = useCallback(() => {
		setCurrentFocus(FOCUS_ID.chat);
	}, []);
	const focusOnMenu = useCallback(() => {
		setCurrentFocus(FOCUS_ID.menu);
	}, []);

	useInput((_, key) => {
		if (currentFocus === FOCUS_ID.chat) {
			if (key.escape) {
				focusOnMenu();
				return;
			}
			if (key.tab) {
				focusOnMenu();
				return;
			}
			return;
		}

		if (currentFocus === FOCUS_ID.menu) {
			if (key.return) {
				focusOnChat();
				return;
			}
			if (key.tab) {
				focusOnChat();
				return;
			}
			return;
		}
	});
}

export default useFocusManagement;
