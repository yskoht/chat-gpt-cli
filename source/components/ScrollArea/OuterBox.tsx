import {Box, measureElement} from 'ink';
import React, {useEffect, useContext, useRef} from 'react';
import {useStore} from 'zustand';

import {isNullable} from '@/utilities/index.js';

import {ScrollAreaContext} from './ScrollAreaContext.js';
import ScrollBar from './ScrollBar.js';
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
	const store = useContext(ScrollAreaContext);
	const {setOuterHeight} = useStore(store, ({setOuterHeight}) => ({
		setOuterHeight,
	}));
	const ref = useRef(null);

	useEffect(() => {
		if (!isNullable(ref.current)) {
			const dimensions = measureElement(ref.current);
			setOuterHeight(dimensions.height);
		}
	}, [setOuterHeight]);

	return (
		<Box justifyContent="space-between" width="100%" height={height}>
			<Box ref={ref} flexDirection="column" overflow="hidden">
				{children}
			</Box>
			<ScrollBar visibility={scrollBarVisibility} color={scrollBarColor} />
		</Box>
	);
}

export default OuterBox;
