import React, {useState, useMemo} from 'react';
import {Text, useInput, Key, Box} from 'ink';

import {LINE_SEP} from './constants.js';
import {Cursor} from './types.js';
import {toPosition, replaceLineSep} from './utilities.js';

import * as edit from './edit.js';
import * as keymap from './keymap.js';

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
	showCursor?: boolean;
	cursorColor?: string;
};
function MultiLineTextInput({
	value,
	onChange,
	onSubmit,
	shouldSubmit = keymap.hittingEnter,
	showCursor = true,
	cursorColor = 'gray',
}: Props) {
	const [cursor, setCursor] = useState<Cursor>(0);
	const cursorBgColor = useMemo(
		() => (showCursor ? cursorColor : undefined),
		[showCursor, cursorColor],
	);

	useInput((_input, key) => {
		const input = replaceLineSep(_input);

		if (shouldSubmit(input, key)) {
			onSubmit(value);
			return;
		}

		const {nextValue, nextCursor} = (() => {
			if (keymap.shouldMoveUp(input, key)) {
				return edit.moveUp(cursor, value);
			}
			if (keymap.shouldMoveDown(input, key)) {
				return edit.moveDown(cursor, value);
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
			return edit.add(cursor, value, input);
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
				const key = `${y}-${text}`;
				return (
					<Box key={key}>
						{y === cy ? (
							<>
								<Text>{text.slice(0, cx)}</Text>
								<Text backgroundColor={cursorBgColor}>{text[cx]}</Text>
								<Text>{text.slice(cx + 1)}</Text>
								{text.length === cx && (
									<Text backgroundColor={cursorBgColor}> </Text>
								)}
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
