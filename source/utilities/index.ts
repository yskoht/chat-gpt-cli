export const LINE_SEP = '\n';
export const SPACE = ' ';

export function isNullable(x: unknown): x is undefined | null {
	return x == null;
}

export const nop = () => undefined;

export function replaceLineSep(value: string): string {
	return value.replace(/\r\n?/g, LINE_SEP);
}

export function toLines(value: string): string[] {
	return value.split(LINE_SEP);
}

export function assertNever(x: never): never {
	throw new Error(x);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(x: unknown): x is Function {
	return typeof x === 'function';
}
