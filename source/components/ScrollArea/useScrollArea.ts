import {useContext} from 'react';
import {useStore} from 'zustand';

import {ScrollAreaContext} from './ScrollAreaContext.js';

function useScrollArea() {
	const store = useContext(ScrollAreaContext);
	const apis = useStore(
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

	return apis;
}

export default useScrollArea;
