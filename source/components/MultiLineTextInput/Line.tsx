import {Text} from 'ink';
import React from 'react';

import {isNullable, SPACE} from '@/utilities/index.js';

import {CURSOR_SHAPE} from './constants.js';
import {CursorShape, Position} from './types.js';

type Props = {
	text: string;
	currentPosition: Position;
	isCursorAtCurrentLine: boolean;
	isCursorAtTailOfLine: boolean;
	cursorColor: string | undefined;
	cursorShape: CursorShape;
};
function Line({
	text,
	currentPosition: {x},
	isCursorAtCurrentLine,
	isCursorAtTailOfLine,
	cursorColor,
	cursorShape,
}: Props) {
	if (!isCursorAtCurrentLine) {
		return <Text>{`${text}${SPACE}`} </Text>;
	}

	return (
		<Text>
			<Text>{text.slice(0, x)}</Text>
			{!isNullable(text[x]) && (
				<CursorMark
					cursorColor={cursorColor}
					cursorShape={cursorShape}
					char={text[x]}
				/>
			)}
			<Text>{text.slice(x + 1)}</Text>
			{isCursorAtTailOfLine && (
				<CursorMark cursorColor={cursorColor} cursorShape={cursorShape} />
			)}
		</Text>
	);
}

export default React.memo(Line);

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
