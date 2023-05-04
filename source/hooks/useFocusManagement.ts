import {useInput, useFocusManager} from 'ink';

function useFocusManagement() {
	const {focusNext, focusPrevious} = useFocusManager();

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

export default useFocusManagement;
