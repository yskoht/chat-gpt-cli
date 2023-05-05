import {Key} from 'ink';

export function hittingEnter(_input: string, key: Key) {
	return key.return;
}

export function shouldMoveUp(input: string, key: Key): boolean {
	return key.upArrow || (key.ctrl && input === 'p');
}

export function shouldMoveDown(input: string, key: Key): boolean {
	return key.downArrow || (key.ctrl && input === 'n');
}

export function shouldMoveLeft(input: string, key: Key): boolean {
	return key.leftArrow || (key.ctrl && input === 'b');
}

export function shouldMoveRight(input: string, key: Key): boolean {
	return key.rightArrow || (key.ctrl && input === 'f');
}

export function shouldMoveHead(input: string, key: Key): boolean {
	return key.ctrl && input === 'a';
}

export function shouldMoveTail(input: string, key: Key): boolean {
	return key.ctrl && input === 'e';
}

export function shouldBackspace(input: string, key: Key): boolean {
	return key.backspace || (key.ctrl && input === 'h');
}

export function shouldDelete(input: string, key: Key): boolean {
	return key.delete || (key.ctrl && input === 'd');
}

export function shouldKill(input: string, key: Key): boolean {
	return key.ctrl && input === 'k';
}
