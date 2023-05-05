import {useContext} from 'react';
import {useStore} from 'zustand';

import {ScrollAreaContext} from './ScrollAreaContext.js';
import {ScrollAreaApi} from './types.js';

function useScrollArea() {
	const store = useContext(ScrollAreaContext);
	const api: ScrollAreaApi = useStore(
		store,
		({
			scrollDown,
			scrollUp,
			scrollToTop,
			scrollToBottom,
			recalculateComponentSize,
		}) => ({
			scrollDown,
			scrollUp,
			scrollToTop,
			scrollToBottom,
			recalculateComponentSize,
		}),
	);

	return api;
}

export default useScrollArea;
