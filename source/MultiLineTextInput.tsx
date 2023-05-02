import React, {useState, useMemo} from 'react';
import {Text, useInput, Key, Box} from 'ink';

const DEBUG = false;
function debug(...args: any[]) {
	if (DEBUG) {
		console.log(...args);
	}
}

type Props = {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (value: string) => void;
	shouldSubmit?: (input: string, key: Key) => boolean;
};

function hittingEnter(_input: string, key: Key) {
	return key.return;
}

const LINE_SEP = '\r';
function replaceLineSep(value: string): string {
	return value.replace(/\n/g, LINE_SEP);
}

function toLines(value: string): string[] {
	return value.split(LINE_SEP);
}

type Cursor = number;
type Position = {
	x: number;
	y: number;
};
function toPosition(cursor: Cursor, value: string): Position {
	const lines = toLines(value.slice(0, cursor));
	const y = Math.max(lines.length - 1, 0);
	const x = lines[y]?.length ?? 0;
	return {x, y};
}
function toCursor(x: number, y: number, value: string): Cursor {
	const lines = toLines(value);
	const len = (line: string) => line.length + 1; // for line sep
	const cursor =
		lines.slice(0, y).reduce((acc, line) => acc + len(line), 0) + x;
	return cursor;
}

type Next = {
	nextCursor: Cursor;
	nextValue: string;
};
function moveUp(cursor: Cursor, value: string): Next {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	const ny = Math.max(y - 1, 0);
	const nx = Math.min(x, lines[ny]!.length);
	const nextCursor = toCursor(nx, ny, value);
	return {nextCursor, nextValue: value};
}
function moveDown(cursor: Cursor, value: string): Next {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	const ny = Math.min(y + 1, lines.length - 1);
	const nx = Math.min(x, lines[ny]!.length);
	const nextCursor = toCursor(nx, ny, value);
	return {nextCursor, nextValue: value};
}
function moveLeft(cursor: Cursor, value: string): Next {
	const {x, y} = toPosition(cursor, value);
	const nx = Math.max(x - 1, 0);
	const nextCursor = toCursor(nx, y, value);
	return {nextCursor, nextValue: value};
}
function moveRight(cursor: Cursor, value: string): Next {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	const nx = Math.min(x + 1, lines[y]!.length);
	const nextCursor = toCursor(nx, y, value);
	return {nextCursor, nextValue: value};
}
function moveHead(cursor: Cursor, value: string): Next {
	const {y} = toPosition(cursor, value);
	const nx = 0;
	const nextCursor = toCursor(nx, y, value);
	return {nextCursor, nextValue: value};
}
function moveTail(cursor: Cursor, value: string): Next {
	const {y} = toPosition(cursor, value);
	const lines = toLines(value);
	const nx = lines[y]!.length;
	const nextCursor = toCursor(nx, y, value);
	return {nextCursor, nextValue: value};
}
function add(cursor: Cursor, value: string, input: string): Next {
	const nextValue = value.slice(0, cursor) + input + value.slice(cursor);
	const nextCursor = cursor + input.length;
	return {
		nextCursor,
		nextValue,
	};
}
function backspace(cursor: Cursor, value: string): Next {
	if (cursor === 0) {
		return {nextCursor: cursor, nextValue: value};
	}

	const nextCursor = cursor - 1;
	const nextValue = value.slice(0, cursor - 1) + value.slice(cursor);
	return {
		nextCursor,
		nextValue,
	};
}
function del(cursor: Cursor, value: string): Next {
	const nextCursor = cursor;
	const nextValue = value.slice(0, cursor) + value.slice(cursor + 1);
	return {
		nextCursor,
		nextValue,
	};
}

function shouldMoveUp(input: string, key: Key): boolean {
	return key.upArrow || (key.ctrl && input === 'p');
}
function shouldMoveDown(input: string, key: Key): boolean {
	return key.downArrow || (key.ctrl && input === 'n');
}
function shouldMoveLeft(input: string, key: Key): boolean {
	return key.leftArrow || (key.ctrl && input === 'b');
}
function shouldMoveRight(input: string, key: Key): boolean {
	return key.rightArrow || (key.ctrl && input === 'f');
}
function shouldMoveHead(input: string, key: Key): boolean {
	return key.ctrl && input === 'a';
}
function shouldMoveTail(input: string, key: Key): boolean {
	return key.ctrl && input === 'e';
}
function shouldBackspace(input: string, key: Key): boolean {
	return key.backspace || (key.ctrl && input === 'h');
}
function shouldDelete(input: string, key: Key): boolean {
	return key.delete || (key.ctrl && input === 'd');
}

function MultiLineTextInput({
	value,
	onChange,
	onSubmit,
	shouldSubmit = hittingEnter,
}: Props) {
	const [cursor, setCursor] = useState<Cursor>(0);

	useInput((_input, key) => {
		const input = replaceLineSep(_input);

		if (shouldSubmit(input, key)) {
			onSubmit(value);
			return;
		}

		const {nextValue, nextCursor} = (() => {
			if (shouldMoveUp(input, key)) {
				return moveUp(cursor, value);
			}
			if (shouldMoveDown(input, key)) {
				return moveDown(cursor, value);
			}
			if (shouldMoveLeft(input, key)) {
				return moveLeft(cursor, value);
			}
			if (shouldMoveRight(input, key)) {
				return moveRight(cursor, value);
			}
			if (shouldMoveHead(input, key)) {
				return moveHead(cursor, value);
			}
			if (shouldMoveTail(input, key)) {
				return moveTail(cursor, value);
			}
			if (shouldBackspace(input, key)) {
				return backspace(cursor, value);
			}
			if (shouldDelete(input, key)) {
				return del(cursor, value);
			}
			return add(cursor, value, input);
		})();

		debug({input, key, cursor, value, nextValue, nextCursor});

		onChange(nextValue);
		setCursor(nextCursor);
	});

	const {x: cx, y: cy} = useMemo(
		() => toPosition(cursor, value),
		[cursor, value],
	);
	const texts = useMemo(
		() =>
			value.split(LINE_SEP).map((text, y) => {
				return (
					<Box key={y}>
						{y === cy ? (
							<>
								<Text>{text.slice(0, cx)}</Text>
								<Text backgroundColor="green">{text[cx]}</Text>
								<Text>{text.slice(cx + 1)}</Text>
								{text.length === cx && <Text backgroundColor="green"> </Text>}
							</>
						) : (
							<Text>{text.length ? text : ' '}</Text>
						)}
					</Box>
				);
			}),
		[cx, cy, value],
	);

	return <>{texts}</>;
}

export default MultiLineTextInput;
