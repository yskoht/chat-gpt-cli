import {LINE_SEP} from '@/utilities/index.js';

import {Cursor, Position} from './types.js';

export function toLines(value: string): string[] {
	return value.split(LINE_SEP);
}

export function toPosition(cursor: Cursor, value: string): Position {
	const lines = toLines(value.slice(0, cursor));
	const y = Math.max(lines.length - 1, 0);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

export function replaceTab(value: string): string {
	return value.replace(/\t/g, '  ');
}
