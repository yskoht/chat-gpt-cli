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

type Props = {
	children: React.ReactNode;
};
function InnerBox({children}: Props) {
	const ref = useRef(null);
	const store = useContext(ScrollAreaContext);
	const {setInnerHeight, positionFromInnerTop, setRecalculateComponentSize} =
		useStore(
			store,
			({
				setInnerHeight,
				positionFromInnerTop,
				setRecalculateComponentSize,
			}) => ({
				setInnerHeight,
				positionFromInnerTop,
				setRecalculateComponentSize,
			}),
		);

	const calculateComponentSize = useCallback(() => {
		if (isNullable(ref.current)) {
			return;
		}

		const dimensions = measureElement(ref.current);
		setInnerHeight(dimensions.height);
	}, [setInnerHeight]);

	useEffect(() => {
		calculateComponentSize();
		setRecalculateComponentSize(calculateComponentSize);
	}, [calculateComponentSize, setRecalculateComponentSize]);

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
