import {Text, Box} from 'ink';
import React, {useContext, useCallback, useMemo} from 'react';
import {useStore} from 'zustand';

import {SPACE} from '@/utilities/index.js';

import {ScrollAreaContext} from './ScrollAreaContext.js';
import {SCROLL_BAR_VISIBILITY} from './constants.js';
import {ScrollBarVisibility} from './types.js';

const SCROLL_BAR_CHAR = SPACE;
const SCROLL_BAR_BACKGROUND_COLOR = 'gray';

function shouldShowScrollBar(innerHeight: number, outerHeight: number) {
	return innerHeight > outerHeight;
}

function isThisPositionBar(
	scrollBarPosition: number,
	scrollBarHeight: number,
	position: number,
): boolean {
	return (
		scrollBarPosition <= position &&
		position < scrollBarPosition + scrollBarHeight
	);
}

function calcScrollBar(
	outerHeight: number,
	innerHeight: number,
	positionFromInnerTop: number,
) {
	const scrollBarRate = Math.min(1.0, outerHeight / innerHeight);
	const scrollBarHeight = Math.ceil(outerHeight * scrollBarRate);

	const scrollBarPositionMax = outerHeight - scrollBarHeight;
	const scrollBarPosition = Math.min(
		Math.ceil(outerHeight * (positionFromInnerTop / innerHeight)),
		scrollBarPositionMax,
	);

	return {
		scrollBarHeight,
		scrollBarPosition,
	};
}

function Space() {
	return <Text>{SPACE}</Text>;
}

function Bar() {
	return (
		<Text backgroundColor={SCROLL_BAR_BACKGROUND_COLOR}>{SCROLL_BAR_CHAR}</Text>
	);
}

type ScrollBarProps = {
	innerHeight: number;
	outerHeight: number;
	positionFromInnerTop: number;
};
function ScrollBar({
	innerHeight,
	outerHeight,
	positionFromInnerTop,
}: ScrollBarProps) {
	const {scrollBarHeight, scrollBarPosition} = useMemo(
		() => calcScrollBar(outerHeight, innerHeight, positionFromInnerTop),
		[outerHeight, innerHeight, positionFromInnerTop],
	);

	const _isThisPositionBar = useCallback(
		(position: number) =>
			isThisPositionBar(scrollBarPosition, scrollBarHeight, position),
		[scrollBarHeight, scrollBarPosition],
	);

	const scrollBar = useMemo(() => {
		const positions = new Array(outerHeight).fill(0).map((_, i) => i);
		return positions.map((position) => {
			const isBar = _isThisPositionBar(position);
			return isBar ? <Bar key={position} /> : <Space key={position} />;
		});
	}, [outerHeight, _isThisPositionBar]);

	return (
		<Box flexDirection="column" paddingLeft={1}>
			{scrollBar}
		</Box>
	);
}

type ScrollBarContainerProps = {
	visibility: ScrollBarVisibility;
};
function ScrollBarContainer({visibility}: ScrollBarContainerProps) {
	const store = useContext(ScrollAreaContext);
	const {innerHeight, outerHeight, positionFromInnerTop} = useStore(
		store,
		({innerHeight, outerHeight, positionFromInnerTop}) => ({
			innerHeight,
			outerHeight,
			positionFromInnerTop,
		}),
	);

	if (visibility === SCROLL_BAR_VISIBILITY.hidden) {
		return null;
	}
	if (
		visibility === SCROLL_BAR_VISIBILITY.auto &&
		!shouldShowScrollBar(innerHeight, outerHeight)
	) {
		return null;
	}

	return (
		<ScrollBar
			innerHeight={innerHeight}
			outerHeight={outerHeight}
			positionFromInnerTop={positionFromInnerTop}
		/>
	);
}

export default ScrollBarContainer;
