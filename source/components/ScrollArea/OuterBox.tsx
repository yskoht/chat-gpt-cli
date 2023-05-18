import {Box, measureElement} from 'ink';
import React, {useEffect, useCallback, useContext, useRef} from 'react';
import {useStore} from 'zustand';

import {isNullable} from '@/utilities/index.js';

import {ScrollAreaContext} from './ScrollAreaContext.js';
import ScrollBar from './ScrollBar.js';
import log from './log.js';
import {ScrollBarVisibility} from './types.js';

type Props = {
	children: React.ReactNode;
	height: number | string | undefined;
	scrollBarVisibility: ScrollBarVisibility;
	scrollBarColor: string | undefined;
};

function OuterBox({
	children,
	height,
	scrollBarVisibility,
	scrollBarColor,
}: Props) {
	const ref = useRef(null);
	const store = useContext(ScrollAreaContext);
	const {setOuterHeight, setFetchOuterHeight} = useStore(
		store,
		({setOuterHeight, setFetchOuterHeight}) => ({
			setOuterHeight,
			setFetchOuterHeight,
		}),
	);

	const fetchOuterHeight = useCallback(() => {
		if (isNullable(ref.current)) {
			return;
		}

		const dimensions = measureElement(ref.current);
		setOuterHeight(dimensions.height - 1);
		log().debug({dimensions}, 'OuterBox dimensions');
	}, [setOuterHeight]);

	useEffect(() => {
		fetchOuterHeight();
		setFetchOuterHeight(fetchOuterHeight);
	}, [fetchOuterHeight, setFetchOuterHeight]);

	return (
		<Box justifyContent="space-between" width="100%" height={height}>
			<Box ref={ref} flexDirection="column" overflow="hidden">
				{children}
			</Box>
			<ScrollBar visibility={scrollBarVisibility} color={scrollBarColor} />
		</Box>
	);
}

export default React.memo(OuterBox);
