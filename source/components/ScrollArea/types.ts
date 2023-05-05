import {Key} from 'ink';

import {SCROLL_BAR_VISIBILITY} from './constants.js';

export type ScrollBarVisibility = keyof typeof SCROLL_BAR_VISIBILITY;
export type ScrollAreaApi = {
	scrollDown: (offset: number) => void;
	scrollUp: (offset: number) => void;
	scrollToTop: () => void;
	scrollToBottom: () => void;
	recalculateComponentSize: () => void;
};
export type ScrollHandler = (
	input: string,
	key: Key,
	api: ScrollAreaApi,
) => void;
export type recalculateComponentSize = () => void;
