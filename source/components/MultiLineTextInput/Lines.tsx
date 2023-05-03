import React, {useMemo} from 'react';
import {Box} from 'ink';

import {Cursor, CursorShape, Position} from './types.js';
import {toLines, toPosition} from './utilities.js';
import Line from './Line.js';
import {replaceLineSep} from './utilities.js';

type Props = {
	cursor: Cursor;
	value: string;
	showCursor: boolean;
	cursorColor: string;
	cursorShape: CursorShape;
};

function keyExtractor(text: string, index: number): string {
	return `${index}-${text}`;
}

function isCurrentLine(currentPosition: Position, index: number): boolean {
	return currentPosition.y === index;
}

function isTailOfLine(currentPosition: Position, text: string): boolean {
	return currentPosition.x === text.length;
}

function Lines({
	cursor,
	value,
	showCursor,
	cursorColor: _cursorColor,
	cursorShape,
}: Props) {
	const cursorColor = useMemo(
		() => (showCursor ? _cursorColor : undefined),
		[showCursor, _cursorColor],
	);

	const currentPosition = useMemo(
		() => toPosition(cursor, value),
		[cursor, value],
	);

	const _lines = useMemo(() => toLines(replaceLineSep(value)), [value]);
	const lines = useMemo(
		() =>
			_lines.map((text, y) => {
				const key = keyExtractor(text, y);
				const _isCurrentLine = isCurrentLine(currentPosition, y);
				const _isTailOfLine = isTailOfLine(currentPosition, text);
				return (
					<Box key={key}>
						<Line
							text={text}
							currentPosition={currentPosition}
							isCurrentLine={_isCurrentLine}
							isTailOfLine={_isTailOfLine}
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

export default Lines;
