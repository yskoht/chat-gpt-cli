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

function toLines(value: string): string[] {
	return value.split(LINE_SEP);
}

type Position = {
	x: number;
	y: number;
};
function toPosition(cursor: number, value: string): Position {
	const lines = toLines(value.slice(0, cursor));
	const y = Math.max(lines.length - 1, 0);
	const x = lines[y]?.length ?? 0;
	return {x, y};
}

function toCursor(x: number, y: number, value: string): number {
	const lines = toLines(value);
	const cursor =
		lines
			.slice(0, y)
			.reduce(
				(acc, line) => acc + line.length + (y !== lines.length ? 1 : 0),
				0,
			) + x;
	return cursor;
}

function moveUp(cursor: number, value: string): number {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	const ny = Math.max(y - 1, 0);
	const nx = Math.min(x, lines[ny]!.length);
	const nextCursor = toCursor(nx, ny, value);
	return nextCursor;
}
function moveDown(cursor: number, value: string): number {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	const ny = Math.min(y + 1, lines.length - 1);
	const nx = Math.min(x, lines[ny]!.length);
	const nextCursor = toCursor(nx, ny, value);
	return nextCursor;
}
function moveLeft(cursor: number, value: string): number {
	const {x, y} = toPosition(cursor, value);
	const nx = Math.max(x - 1, 0);
	const nextCursor = toCursor(nx, y, value);
	return nextCursor;
}
function moveRight(cursor: number, value: string): number {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	const nx = Math.min(x + 1, lines[y]!.length);
	const nextCursor = toCursor(nx, y, value);
	return nextCursor;
}
function moveHead(cursor: number, value: string): number {
	const {y} = toPosition(cursor, value);
	const nx = 0;
	const nextCursor = toCursor(nx, y, value);
	return nextCursor;
}
function moveTail(cursor: number, value: string): number {
	const {y} = toPosition(cursor, value);
	const lines = toLines(value);
	const nx = lines[y]!.length;
	const nextCursor = toCursor(nx, y, value);
	return nextCursor;
}

function add(cursor: number, value: string, input: string) {
	const nextValue = value.slice(0, cursor) + input + value.slice(cursor);
	const nextCursor = cursor + input.length;
	return {
		nextCursor,
		nextValue,
	};
}
function backspace(cursor: number, value: string) {
	const {x} = toPosition(cursor, value);
	if (x === 0) {
		return {nextCursor: cursor, nextValue: value};
	}

	const nextCursor = cursor - 1;
	const nextValue = value.slice(0, cursor - 1) + value.slice(cursor);
	return {
		nextCursor,
		nextValue,
	};
}
function del(cursor: number, value: string) {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	if (x === lines[y]!.length) {
		return {nextCursor: cursor, nextValue: value};
	}

	const nextCursor = cursor;
	const nextValue = value.slice(0, cursor) + value.slice(cursor + 1);
	return {
		nextCursor,
		nextValue,
	};
}

function TextInput({
	value,
	onChange,
	onSubmit,
	shouldSubmit = hittingEnter,
}: Props) {
	const [cursor, setCursor] = useState(0);

	useInput((input, key) => {
		if (shouldSubmit(input, key)) {
			onSubmit(value);
			return;
		}

		{
			const nextCursor = (() => {
				if (key.upArrow || (key.ctrl && input === 'p')) {
					return moveUp(cursor, value);
				}
				if (key.downArrow || (key.ctrl && input === 'n')) {
					return moveDown(cursor, value);
				}
				if (key.leftArrow || (key.ctrl && input === 'b')) {
					return moveLeft(cursor, value);
				}
				if (key.rightArrow || (key.ctrl && input === 'f')) {
					return moveRight(cursor, value);
				}
				if (key.ctrl && input === 'a') {
					return moveHead(cursor, value);
				}
				if (key.ctrl && input === 'e') {
					return moveTail(cursor, value);
				}
				return null;
			})();
			if (nextCursor !== null) {
				setCursor(nextCursor);
				return;
			}
		}

		{
			const {nextValue, nextCursor} = (() => {
				if (key.backspace || (key.ctrl && input === 'h')) {
					return backspace(cursor, value);
				}
				if (key.delete || (key.ctrl && input === 'd')) {
					return del(cursor, value);
				}
				return add(cursor, value, input);
			})();
			onChange(nextValue);
			setCursor(nextCursor);
		}
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

export default TextInput;
