import {useInput, Key} from 'ink';
import {useMemo} from 'react';

import {ScrollHandler as ScrollHandlerType} from './types.js';
import useScrollArea from './useScrollArea.js';

const defaultScrollHandler: ScrollHandlerType = (_, key, api) => {
	if (key.downArrow) {
		api.scrollDown(1);
		return;
	}

	if (key.upArrow) {
		api.scrollUp(1);
		return;
	}
};

type Props = {
	isActive: boolean;
	scrollHandler: ScrollHandlerType | undefined;
};
function ScrollHandler({isActive, scrollHandler}: Props) {
	const api = useScrollArea();

	const handler = useMemo(() => {
		const _handler = scrollHandler ?? defaultScrollHandler;
		return (input: string, key: Key) => _handler(input, key, api);
	}, [scrollHandler, api]);

	useInput(handler, {isActive});

	return null;
}

export default ScrollHandler;
