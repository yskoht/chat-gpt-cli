import {useInput} from 'ink';
import {useContext} from 'react';
import {useStore} from 'zustand';

import {ScrollAreaContext} from './ScrollAreaContext.js';

type Props = {
	isActive: boolean;
};
function ScrollHandler({isActive}: Props) {
	const store = useContext(ScrollAreaContext);
	const {scrollDown, scrollUp} = useStore(store, ({scrollDown, scrollUp}) => ({
		scrollDown,
		scrollUp,
	}));

	useInput(
		(_input, key) => {
			if (key.downArrow) {
				scrollDown(1);
				return;
			}
			if (key.upArrow) {
				scrollUp(1);
				return;
			}
		},
		{isActive},
	);

	return null;
}

export default ScrollHandler;
