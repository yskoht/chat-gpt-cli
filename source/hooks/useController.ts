import {useInput, useFocusManager} from 'ink';
import {useEffect} from 'react';

function useController() {
	const {enableFocus, focusNext, focusPrevious} = useFocusManager();

	useEffect(() => {
		enableFocus();
	}, [enableFocus]);

	useInput((_, key) => {
		if (key.escape) {
			process.exit();
		}
		if (key.downArrow) {
			focusNext();
			return;
		}
		if (key.upArrow) {
			focusPrevious();
			return;
		}
	});
}

export default useController;
