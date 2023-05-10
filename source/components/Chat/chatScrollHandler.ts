import {ScrollHandler} from '../ScrollArea/types.js';

export const chatScrollHandler: ScrollHandler = (_, key, api) => {
	if (key.shift && key.downArrow) {
		api.scrollDown(10);
		return;
	}

	if (key.shift && key.upArrow) {
		api.scrollUp(10);
		return;
	}

	if (key.shift && key.leftArrow) {
		api.scrollToTop();
		return;
	}

	if (key.shift && key.rightArrow) {
		api.scrollToBottom();
		return;
	}

	if (key.ctrl && key.downArrow) {
		api.scrollDown(1);
		return;
	}

	if (key.ctrl && key.upArrow) {
		api.scrollUp(1);
		return;
	}
};
