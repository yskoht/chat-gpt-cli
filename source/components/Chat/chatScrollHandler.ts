import {ScrollHandler} from '../ScrollArea/types.js';
import log from './log.js';

export const chatScrollHandler: ScrollHandler = (_, key, api) => {
	if (key?.name === 'pagedown') {
		api.scrollDown(10);
		log().debug('scroll down 10');
		return;
	}

	if (key?.name === 'pageup') {
		api.scrollUp(10);
		log().debug('scroll up 10');
		return;
	}

	if (key?.name === 'home') {
		api.scrollToTop();
		log().debug('scroll to top');
		return;
	}

	if (key?.name === 'end') {
		api.scrollToBottom();
		log().debug('scroll to bottom');
		return;
	}
};
