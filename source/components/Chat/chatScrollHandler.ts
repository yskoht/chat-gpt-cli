import {ScrollHandler} from '../ScrollArea/types.js';
import log from './log.js';

export const chatScrollHandler: ScrollHandler = (_, key, api) => {
	if (key.shift && key.downArrow) {
		api.scrollDown(10);
		log().debug('scroll down 10');
		return;
	}

	if (key.shift && key.upArrow) {
		api.scrollUp(10);
		log().debug('scroll up 10');
		return;
	}

	if (key.shift && key.leftArrow) {
		api.scrollToTop();
		log().debug('scroll to top');
		return;
	}

	if (key.shift && key.rightArrow) {
		api.scrollToBottom();
		log().debug('scroll to bottom');
		return;
	}

	if (key.ctrl && key.downArrow) {
		api.scrollDown(1);
		log().debug('scroll down 1');
		return;
	}

	if (key.ctrl && key.upArrow) {
		api.scrollUp(1);
		log().debug('scroll up 1');
		return;
	}
};
