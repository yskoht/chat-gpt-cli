import {Key} from '@/hooks/useKeypress.js';

import {SCROLL_BAR_VISIBILITY} from './constants.js';

export type ScrollBarVisibility = keyof typeof SCROLL_BAR_VISIBILITY;
export type ScrollAreaApi = {
	scrollDown: (offset: number) => void;
	scrollUp: (offset: number) => void;
	scrollToTop: () => void;
	scrollToBottom: () => void;
	resize: () => void;
	outerHeight: number;
	innerHeight: number;
	positionFromInnerTop: number;
};
export type ScrollHandler = (
	input: string,
	key: Key | undefined,
	api: ScrollAreaApi,
) => void;

export type FetchSize = () => void;
