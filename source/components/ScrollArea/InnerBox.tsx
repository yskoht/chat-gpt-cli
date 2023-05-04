import {Box, measureElement} from 'ink';
import React, {useRef, useEffect, useContext, useMemo} from 'react';
import {useStore} from 'zustand';

import {isNullable} from '@/utilities/index.js';

import {ScrollAreaContext} from './ScrollAreaContext.js';

type Props = {
	children: React.ReactNode;
};
function InnerBox({children}: Props) {
	const ref = useRef(null);
	const store = useContext(ScrollAreaContext);
	const {setInnerHeight, positionFromInnerTop} = useStore(
		store,
		({setInnerHeight, positionFromInnerTop}) => ({
			setInnerHeight,
			positionFromInnerTop,
		}),
	);

	useEffect(() => {
		if (!isNullable(ref.current)) {
			const dimensions = measureElement(ref.current);
			setInnerHeight(dimensions.height);
		}
	}, [setInnerHeight]);

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
