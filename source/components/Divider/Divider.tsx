import {Text, Box, measureElement} from 'ink';
import React, {useRef, useEffect, useState, useMemo, useCallback} from 'react';

import useDimension from '@/hooks/useDimension.js';
import {isNullable} from '@/utilities/index.js';

import log from './log.js';

const DIVIDER = '─';

function calcPadding(
	p: number | undefined,
	padding: number | undefined,
): number {
	return p ?? padding ?? 0;
}

function calcDividerWidth(
	width: number,
	paddingLeft: number,
	paddingRight: number,
): number {
	return Math.max(width - paddingLeft - paddingRight - 1, 0);
}

type Props = {
	padding?: number;
	paddingTop?: number;
	paddingRight?: number;
	paddingBottom?: number;
	paddingLeft?: number;
	divider?: string;
	color?: string;
};
function Divider({
	padding,
	paddingTop,
	paddingRight,
	paddingBottom,
	paddingLeft,
	divider = DIVIDER,
	color,
}: Props) {
	const ref = useRef(null);
	const window = useDimension();
	const [width, setWidth] = useState(0);

	const _paddingTop = useMemo(
		() => calcPadding(paddingTop, padding),
		[paddingTop, padding],
	);
	const _paddingRight = useMemo(
		() => calcPadding(paddingRight, padding),
		[paddingRight, padding],
	);
	const _paddingBottom = useMemo(
		() => calcPadding(paddingBottom, padding),
		[paddingBottom, padding],
	);
	const _paddingLeft = useMemo(
		() => calcPadding(paddingLeft, padding),
		[paddingLeft, padding],
	);

	const _divider = useMemo(() => {
		const w = calcDividerWidth(width, _paddingLeft, _paddingRight);
		return divider.repeat(w);
	}, [divider, width, _paddingLeft, _paddingRight]);

	const resize = useCallback(() => {
		if (isNullable(ref.current)) {
			return;
		}
		const {width} = measureElement(ref.current);
		setWidth(width);
		log().debug({width}, 'divider width changed');
	}, []);

	useEffect(() => {
		process.nextTick(resize);
	}, [window, resize]);

	return (
		<Box
			ref={ref}
			paddingTop={_paddingTop}
			paddingRight={_paddingRight}
			paddingBottom={_paddingBottom}
			paddingLeft={_paddingLeft}
		>
			<Text color={color}>{_divider}</Text>
		</Box>
	);
}

export default React.memo(Divider);
