import {useEffect} from 'react';
import {useInput, useFocusManager} from 'ink';

function useController() {
	const {enableFocus, focusNext, focusPrevious} = useFocusManager();

	useEffect(() => {
		enableFocus();
	}, []);

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