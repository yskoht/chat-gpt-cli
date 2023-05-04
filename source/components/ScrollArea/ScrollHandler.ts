import {useInput} from 'ink';
import {useCallback, useMemo} from 'react';

import {ScrollHandler as ScrollHandlerType} from './types.js';
import useScrollArea from './useScrollArea.js';

type Props = {
	isActive: boolean;
	scrollHandler: ScrollHandlerType | undefined;
};
function ScrollHandler({isActive, scrollHandler}: Props) {
	const {scrollDown, scrollUp} = useScrollArea();

	const defaultScrollHandler: ScrollHandlerType = useCallback(
		(_, key) => {
			if (key.downArrow) {
				scrollDown(1);
				return;
			}

			if (key.upArrow) {
				scrollUp(1);
				return;
			}
		},
		[scrollDown, scrollUp],
	);

	const handler = useMemo(
		() => scrollHandler ?? defaultScrollHandler,
		[scrollHandler, defaultScrollHandler],
	);
	useInput(handler, {isActive});

	return null;
}

export default ScrollHandler;
