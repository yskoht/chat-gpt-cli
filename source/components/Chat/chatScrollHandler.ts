import {ScrollHandler} from '../ScrollArea/types.js';

export const chatScrollHandler: ScrollHandler = (input, key, api) => {
	if (key.downArrow || (key.ctrl && input === 'j')) {
		api.scrollDown(1);
		return;
	}

	if (key.upArrow || (key.ctrl && input === 'k')) {
		api.scrollUp(1);
		return;
	}

	if (key.ctrl && input === 'd') {
		api.scrollDown(5);
		return;
	}

	if (key.ctrl && input === 'u') {
		api.scrollUp(5);
		return;
	}

	if (input === '0') {
		api.scrollToTop();
		return;
	}

	if (input === '$') {
		api.scrollToBottom();
		return;
	}
};
