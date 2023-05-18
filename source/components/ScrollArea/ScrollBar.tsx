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

function _Space() {
	return <Text>{SPACE}</Text>;
}
const Space = React.memo(_Space);

type BarProps = {
	color: string | undefined;
};
function _Bar({color}: BarProps) {
	const _backgroundColor = useMemo(
		() => color ?? SCROLL_BAR_BACKGROUND_COLOR,
		[color],
	);
	return <Text backgroundColor={_backgroundColor}>{SCROLL_BAR_CHAR}</Text>;
}
const Bar = React.memo(_Bar);

type ScrollBarProps = {
	innerHeight: number;
	outerHeight: number;
	positionFromInnerTop: number;
	color: string | undefined;
};
function _ScrollBar({
	innerHeight,
	outerHeight,
	positionFromInnerTop,
	color,
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
			return isBar ? (
				<Bar key={position} color={color} />
			) : (
				<Space key={position} />
			);
		});
	}, [outerHeight, _isThisPositionBar, color]);

	return (
		<Box flexDirection="column" paddingLeft={1}>
			{scrollBar}
		</Box>
	);
}
const ScrollBar = React.memo(_ScrollBar);

type ScrollBarContainerProps = {
	visibility: ScrollBarVisibility;
	color: string | undefined;
};
function ScrollBarContainer({visibility, color}: ScrollBarContainerProps) {
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
			color={color}
		/>
	);
}

export default React.memo(ScrollBarContainer);
