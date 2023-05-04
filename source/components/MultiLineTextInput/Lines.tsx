import {highlight} from 'cli-highlight';
import {Box} from 'ink';
import React, {useMemo} from 'react';

import {replaceLineSep, toLines} from '@/utilities/index.js';

import Line from './Line.js';
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

const CODE_BLOCK_REGEXP =
	'(?<codeBlockAll>`{3}(?<codeBlockLanguage>\\w*)\\r?(?<codeBlock>[\\s\\S]*?)`{3}\\r?)';
const UNFINISHED_CODE_BLOCK_REGEXP =
	'(?<unfinishedCodeBlockAll>`{3}(?<unfinishedLanguage>\\w*)\\r?(?<unfinishedCodeBlock>[\\s\\S]*?)$)';
const CODE_LINE_REGEXP = '(?<codeLineAll>`(?<codeLine>[^`]+)`)';

const CODE_REGEXP = new RegExp(
	`${CODE_BLOCK_REGEXP}|${UNFINISHED_CODE_BLOCK_REGEXP}|${CODE_LINE_REGEXP}`,
	'g',
);

type Groups = {
	codeBlockAll: string | undefined;
	codeBlockLanguage: string | undefined;
	codeBlock: string | undefined;

	unfinishedCodeBlockAll: string | undefined;
	unfinishedCodeBlockLanguage: string | undefined;
	unfinishedCodeBlock: string | undefined;

	codeLineAll: string | undefined;
	codeLine: string | undefined;
};

function highlighting(value: string): string {
	const ms = [...value.matchAll(CODE_REGEXP)];

	return ms.reduceRight((acc, m) => {
		const {
			codeBlockAll,
			codeBlockLanguage,
			codeBlock,

			unfinishedCodeBlockAll,
			unfinishedCodeBlockLanguage,
			unfinishedCodeBlock,

			codeLineAll,
			codeLine,
		} = m.groups as Groups;

		if (codeBlockAll && codeBlock && m.index != null) {
			const option = codeBlockLanguage ? {language: codeBlockLanguage} : {};
			const highlighted = highlight(codeBlock, option);
			return (
				acc.slice(0, m.index) +
				highlighted +
				acc.slice(m.index + codeBlockAll.length)
			);
		}

		if (unfinishedCodeBlockAll && unfinishedCodeBlock && m.index != null) {
			const option = unfinishedCodeBlockLanguage
				? {language: unfinishedCodeBlockLanguage}
				: {};
			const highlighted = highlight(unfinishedCodeBlock, option);
			return (
				acc.slice(0, m.index) +
				highlighted +
				acc.slice(m.index + unfinishedCodeBlockAll.length)
			);
		}

		if (codeLineAll && codeLine && m.index != null) {
			const highlighted = `\x1B[1m${codeLine}\x1B[22m`; // tmp
			return (
				acc.slice(0, m.index) +
				highlighted +
				acc.slice(m.index + codeLineAll.length)
			);
		}

		return acc;
	}, value);
}

function preprocess(value: string, enableHighlighting: boolean): string {
	let _value = replaceLineSep(value);
	_value = replaceTab(_value);
	if (enableHighlighting) {
		_value = highlighting(_value);
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
		() => toLines(preprocess(value, enableSyntaxHighlight)),
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

export default Lines;
