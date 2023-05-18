import {useInput, Key} from 'ink';
import React, {useState} from 'react';

import {replaceLineSep} from '@/utilities/index.js';

import Lines from './Lines.js';
import {CURSOR_SHAPE, DEFAULT_CURSOR_COLOR} from './constants.js';
import * as edit from './edit.js';
import * as keymap from './keymap.js';
import log from './log.js';
import {Cursor, CursorShape, OnHistory} from './types.js';

type Props = {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (value: string) => void;
	shouldSubmit?: (input: string, key: Key) => boolean;
	showCursor?: boolean;
	cursorColor?: string;
	cursorShape?: CursorShape;
	isActive?: boolean;
	onHistoryPrev?: OnHistory;
	onHistoryNext?: OnHistory;
	enableSyntaxHighlight?: boolean;
};
function MultiLineTextInput({
	value,
	onChange,
	onSubmit,
	shouldSubmit = keymap.hittingEnter,
	showCursor = true,
	cursorColor = DEFAULT_CURSOR_COLOR,
	cursorShape = CURSOR_SHAPE.block,
	isActive = true,
	onHistoryPrev,
	onHistoryNext,
	enableSyntaxHighlight = true,
}: Props) {
	const [cursor, setCursor] = useState<Cursor>(0);

	useInput(
		(_input, key) => {
			const input = replaceLineSep(_input);

			if (shouldSubmit(input, key)) {
				onSubmit(value);
				return;
			}

			const {nextValue, nextCursor} = (() => {
				if (key.shift && key.downArrow) {
					return {nextCursor: cursor, nextValue: value};
				}

				if (key.shift && key.upArrow) {
					return {nextCursor: cursor, nextValue: value};
				}

				if (key.ctrl && key.downArrow) {
					return {nextCursor: cursor, nextValue: value};
				}

				if (key.ctrl && key.upArrow) {
					return {nextCursor: cursor, nextValue: value};
				}

				if (keymap.shouldMoveUp(input, key)) {
					return edit.moveUp(cursor, value, onHistoryPrev);
				}
				if (keymap.shouldMoveDown(input, key)) {
					return edit.moveDown(cursor, value, onHistoryNext);
				}
				if (keymap.shouldMoveLeft(input, key)) {
					return edit.moveLeft(cursor, value);
				}
				if (keymap.shouldMoveRight(input, key)) {
					return edit.moveRight(cursor, value);
				}
				if (keymap.shouldMoveHead(input, key)) {
					return edit.moveHead(cursor, value);
				}
				if (keymap.shouldMoveTail(input, key)) {
					return edit.moveTail(cursor, value);
				}
				if (keymap.shouldBackspace(input, key)) {
					return edit.backspace(cursor, value);
				}
				if (keymap.shouldDelete(input, key)) {
					return edit.del(cursor, value);
				}
				if (keymap.shouldKill(input, key)) {
					return edit.kill(cursor, value);
				}
				return edit.insert(cursor, value, input);
			})();

			log().debug({input, key, cursor, value, nextValue, nextCursor}, 'input');

			onChange(nextValue);
			setCursor(nextCursor);
		},
		{isActive},
	);

	return (
		<Lines
			cursor={cursor}
			value={value}
			showCursor={showCursor}
			cursorColor={cursorColor}
			cursorShape={cursorShape}
			enableSyntaxHighlight={enableSyntaxHighlight}
		/>
	);
}

export default React.memo(MultiLineTextInput);
