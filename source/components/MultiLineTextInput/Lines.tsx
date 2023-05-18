import {Box} from 'ink';
import React, {useMemo} from 'react';

import {replaceLineSep, toLines} from '@/utilities/index.js';

import Line from './Line.js';
import {highlightCode, highlightUrl} from './highlight.js';
import {Cursor, CursorShape, Position} from './types.js';
import {toPosition, replaceTab} from './utilities.js';

type Props = {
	cursor: Cursor;
	value: string;
	showCursor: boolean;
	cursorColor: string;
	cursorShape: CursorShape;
	enableSyntaxHighlight: boolean;
};

function keyExtractor(text: string, index: number): string {
	return `${index}-${text}`;
}

function isCursorAtCurrentLine(
	currentPosition: Position,
	index: number,
): boolean {
	return currentPosition.y === index;
}

function isCursorAtTailOfLine(
	currentPosition: Position,
	text: string,
): boolean {
	return currentPosition.x === text.length;
}

type PreprocessOption = {
	enableSyntaxHighlight: boolean;
};
function preprocess(
	value: string,
	{enableSyntaxHighlight}: PreprocessOption,
): string {
	let _value = value;
	_value = replaceLineSep(_value);
	_value = replaceTab(_value);
	if (enableSyntaxHighlight) {
		_value = highlightCode(_value);
		_value = highlightUrl(_value);
	}
	return _value;
}

function Lines({
	cursor,
	value,
	showCursor,
	cursorColor: _cursorColor,
	cursorShape,
	enableSyntaxHighlight,
}: Props) {
	const cursorColor = useMemo(
		() => (showCursor ? _cursorColor : undefined),
		[showCursor, _cursorColor],
	);

	const currentPosition = useMemo(
		() => toPosition(cursor, value),
		[cursor, value],
	);

	const _lines = useMemo(
		() => toLines(preprocess(value, {enableSyntaxHighlight})),
		[value, enableSyntaxHighlight],
	);
	const lines = useMemo(
		() =>
			_lines.map((text, y) => {
				const key = keyExtractor(text, y);
				const _isCursorAtCurrentLine = isCursorAtCurrentLine(
					currentPosition,
					y,
				);
				const _isCursorAtTailOfLine = isCursorAtTailOfLine(
					currentPosition,
					text,
				);
				return (
					<Box key={key}>
						<Line
							text={text}
							currentPosition={currentPosition}
							isCursorAtCurrentLine={_isCursorAtCurrentLine}
							isCursorAtTailOfLine={_isCursorAtTailOfLine}
							cursorColor={cursorColor}
							cursorShape={cursorShape}
						/>
					</Box>
				);
			}),
		[_lines, currentPosition, cursorColor, cursorShape],
	);

	return <Box flexDirection="column">{lines}</Box>;
}

export default React.memo(Lines);
