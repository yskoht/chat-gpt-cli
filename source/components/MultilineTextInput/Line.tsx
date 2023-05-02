import React from 'react';
import {Text} from 'ink';

import {Position} from './types.js';

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
};
function Line({
	text,
	currentPosition: {x},
	isCurrentLine,
	isTailOfLine,
	cursorColor,
}: Props) {
	if (!isCurrentLine) {
		return <Text>{isEmpty(text) ? SPACE : text}</Text>;
	}

	return (
		<>
			<Text>{text.slice(0, x)}</Text>
			{!isNullable(text[x]) && (
				<CursorMark cursorColor={cursorColor} char={text[x]} />
			)}
			<Text>{text.slice(x + 1)}</Text>
			{isTailOfLine && <CursorMark cursorColor={cursorColor} />}
		</>
	);
}

export default Line;

type CursorMarkProps = {
	cursorColor: string | undefined;
	char?: string;
};
function CursorMark({cursorColor, char = SPACE}: CursorMarkProps) {
	return <Text backgroundColor={cursorColor}>{char}</Text>;
}
