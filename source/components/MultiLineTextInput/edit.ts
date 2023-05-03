import {LINE_SEP} from './constants.js';
import {Cursor} from './types.js';
import {toPosition, toCursor, toLines} from './utilities.js';

type Next = {
	nextCursor: Cursor;
	nextValue: string;
};

export function moveUp(cursor: Cursor, value: string): Next {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	const ny = Math.max(y - 1, 0);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const nx = Math.min(x, lines[ny]!.length);
	const nextCursor = toCursor(nx, ny, value);
	return {nextCursor, nextValue: value};
}

export function moveDown(cursor: Cursor, value: string): Next {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	const ny = Math.min(y + 1, lines.length - 1);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const nx = Math.min(x, lines[ny]!.length);
	const nextCursor = toCursor(nx, ny, value);
	return {nextCursor, nextValue: value};
}

export function moveLeft(cursor: Cursor, value: string): Next {
	const {x, y} = toPosition(cursor, value);
	const nx = Math.max(x - 1, 0);
	const nextCursor = toCursor(nx, y, value);
	return {nextCursor, nextValue: value};
}

export function moveRight(cursor: Cursor, value: string): Next {
	const {x, y} = toPosition(cursor, value);
	const lines = toLines(value);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const nx = Math.min(x + 1, lines[y]!.length);
	const nextCursor = toCursor(nx, y, value);
	return {nextCursor, nextValue: value};
}

export function moveHead(cursor: Cursor, value: string): Next {
	const {y} = toPosition(cursor, value);
	const nx = 0;
	const nextCursor = toCursor(nx, y, value);
	return {nextCursor, nextValue: value};
}

export function moveTail(cursor: Cursor, value: string): Next {
	const {y} = toPosition(cursor, value);
	const lines = toLines(value);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const nx = lines[y]!.length;
	const nextCursor = toCursor(nx, y, value);
	return {nextCursor, nextValue: value};
}

export function insert(cursor: Cursor, value: string, input: string): Next {
	const nextValue = value.slice(0, cursor) + input + value.slice(cursor);
	const nextCursor = cursor + input.length;
	return {
		nextCursor,
		nextValue,
	};
}

export function backspace(cursor: Cursor, value: string): Next {
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

export function del(cursor: Cursor, value: string): Next {
	const nextCursor = cursor;
	const nextValue = value.slice(0, cursor) + value.slice(cursor + 1);
	return {
		nextCursor,
		nextValue,
	};
}

export function kill(cursor: Cursor, value: string): Next {
	const afterCursor = value.slice(cursor);
	const nextLineSepPos = afterCursor.indexOf(LINE_SEP);

	let nextValue = value.slice(0, cursor);
	if (nextLineSepPos !== -1) {
		nextValue += afterCursor.slice(nextLineSepPos);
	}
	return {
		nextCursor: cursor,
		nextValue,
	};
}
