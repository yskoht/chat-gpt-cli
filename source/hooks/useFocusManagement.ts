import {useInput, useFocusManager} from 'ink';
import {useState, useEffect, useCallback} from 'react';

import logger from '@/libraries/logger.js';

export const FOCUS_ID = {
	chat: 'chat',
	menu: 'menu',
} as const;
type FocusId = keyof typeof FOCUS_ID;

const COMPONENT_NAME = 'useFocusManagement';
function log() {
	return logger().child({component: COMPONENT_NAME});
}

function useFocusManagement() {
	const {focus, disableFocus} = useFocusManager();
	const [currentFocus, setCurrentFocus] = useState<FocusId>(FOCUS_ID.chat);

	useEffect(() => {
		disableFocus();
	}, [disableFocus]);

	useEffect(() => {
		log().debug({currentFocus}, 'focus changed');
		focus(currentFocus);
	}, [focus, currentFocus]);

	const focusOnChat = useCallback(() => {
		setCurrentFocus(FOCUS_ID.chat);
	}, []);
	const focusOnMenu = useCallback(() => {
		setCurrentFocus(FOCUS_ID.menu);
	}, []);

	useInput((_, key) => {
		if (key.escape) {
			// todo
			process.exit(0);
		}

		if (currentFocus === FOCUS_ID.chat) {
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
