import {Box, measureElement} from 'ink';
import React, {
	useCallback,
	useRef,
	useEffect,
	useContext,
	useMemo,
} from 'react';
import {useStore} from 'zustand';

import {isNullable} from '@/utilities/index.js';

import {ScrollAreaContext} from './ScrollAreaContext.js';
import log from './log.js';

type Props = {
	children: React.ReactNode;
};
function InnerBox({children}: Props) {
	const ref = useRef(null);
	const store = useContext(ScrollAreaContext);
	const {setInnerHeight, positionFromInnerTop, setFetchInnerHeight} = useStore(
		store,
		({setInnerHeight, positionFromInnerTop, setFetchInnerHeight}) => ({
			setInnerHeight,
			positionFromInnerTop,
			setFetchInnerHeight,
		}),
	);

	const fetchInnerHeight = useCallback(() => {
		if (isNullable(ref.current)) {
			return;
		}

		const dimensions = measureElement(ref.current);
		setInnerHeight(dimensions.height);
		log().debug({dimensions}, 'InnerBox dimensions');
	}, [setInnerHeight]);

	useEffect(() => {
		fetchInnerHeight();
		setFetchInnerHeight(fetchInnerHeight);
	}, [fetchInnerHeight, setFetchInnerHeight]);

	const marginTop = useMemo(
		() => -positionFromInnerTop,
		[positionFromInnerTop],
	);

	return (
		<Box ref={ref} flexShrink={0} flexDirection="column" marginTop={marginTop}>
			{children}
		</Box>
	);
}

export default InnerBox;
