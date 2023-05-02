import {CURSOR_SHAPE} from './constants.js';

export type Cursor = number;

export type Position = {
	x: number;
	y: number;
};

export type CursorShape = keyof typeof CURSOR_SHAPE;
