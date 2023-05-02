import {Cursor, Position} from './types.js';
import {LINE_SEP} from './constants.js';

export function toLines(value: string): string[] {
	return value.split(LINE_SEP);
}

export function toPosition(cursor: Cursor, value: string): Position {
	const lines = toLines(value.slice(0, cursor));
	const y = Math.max(lines.length - 1, 0);
	const x = lines[y]!.length;
	return {x, y};
}

export function toCursor(x: number, y: number, value: string): Cursor {
	const lines = toLines(value);
	const len = (line: string) => line.length + 1; // for line sep
	const cursor =
		lines.slice(0, y).reduce((acc, line) => acc + len(line), 0) + x;
	return cursor;
}

export function replaceLineSep(value: string): string {
	return value.replace(/\n/g, LINE_SEP);
}
