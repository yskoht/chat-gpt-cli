import {useMemo} from 'react';

import useKeypress, {Key} from '@/hooks/useKeypress.js';

import {ScrollHandler as ScrollHandlerType} from './types.js';
import useScrollArea from './useScrollArea.js';

const defaultScrollHandler: ScrollHandlerType = (_, key, api) => {
	if (key?.name === 'down') {
		api.scrollDown(1);
		return;
	}

	if (key?.name === 'up') {
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
		return (input: string, key: Key | undefined) => _handler(input, key, api);
	}, [scrollHandler, api]);

	useKeypress(handler, {isActive});

	return null;
}

export default ScrollHandler;
