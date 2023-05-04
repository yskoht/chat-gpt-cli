import {Box, measureElement} from 'ink';
import React, {useEffect, useContext, useRef} from 'react';
import {useStore} from 'zustand';

import {isNullable} from '@/utilities/index.js';

import {ScrollAreaContext} from './ScrollAreaContext.js';

type Props = {
	children: React.ReactNode;
	height?: number | string;
};

function OuterBox({children, height}: Props) {
	const ref = useRef(null);

	const store = useContext(ScrollAreaContext);
	const {setOuterHeight} = useStore(store);

	useEffect(() => {
		if (!isNullable(ref.current)) {
			const dimensions = measureElement(ref.current);
			setOuterHeight(dimensions.height);
		}
	}, [setOuterHeight]);

	return (
		<Box ref={ref} height={height} flexDirection="column" overflow="hidden">
			{children}
		</Box>
	);
}

export default OuterBox;
