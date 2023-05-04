import {useContext} from 'react';
import {useStore} from 'zustand';

import {ScrollAreaContext} from './ScrollAreaContext.js';

function useScrollArea() {
	const store = useContext(ScrollAreaContext);
	const {scrollDown, scrollUp} = useStore(store, ({scrollDown, scrollUp}) => ({
		scrollDown,
		scrollUp,
	}));

	return {scrollDown, scrollUp};
}

export default useScrollArea;
