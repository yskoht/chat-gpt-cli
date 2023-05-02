import React from 'react';
import {Text} from 'ink';

import {CursorShape, Position} from './types.js';
import {CURSOR_SHAPE} from './constants.js';

const SPACE = ' ';

function isEmpty(text: string) {
	return text.length === 0;
}

function isNullable(x: unknown) {
	return x == null;
}

type Props = {
	text: string;
	currentPosition: Position;
	isCurrentLine: boolean;
	isTailOfLine: boolean;
	cursorColor: string | undefined;
	cursorShape: CursorShape;
};
function Line({
	text,
	currentPosition: {x},
	isCurrentLine,
	isTailOfLine,
	cursorColor,
	cursorShape,
}: Props) {
	if (!isCurrentLine) {
		return <Text>{isEmpty(text) ? SPACE : text}</Text>;
	}

	return (
		<>
			<Text>{text.slice(0, x)}</Text>
			{!isNullable(text[x]) && (
				<CursorMark
					cursorColor={cursorColor}
					cursorShape={cursorShape}
					char={text[x]}
				/>
			)}
			<Text>{text.slice(x + 1)}</Text>
			{isTailOfLine && (
				<CursorMark cursorColor={cursorColor} cursorShape={cursorShape} />
			)}
		</>
	);
}

export default Line;

type CursorMarkProps = {
	cursorColor: string | undefined;
	cursorShape: CursorShape;
	char?: string;
};
function CursorMark({cursorColor, cursorShape, char = SPACE}: CursorMarkProps) {
	switch (cursorShape) {
		case CURSOR_SHAPE.block:
			return <Text backgroundColor={cursorColor}>{char}</Text>;
		case CURSOR_SHAPE.underline:
			return <Text underline>{char}</Text>;
		default:
			return <Text backgroundColor={cursorColor}>{char}</Text>;
	}
}
