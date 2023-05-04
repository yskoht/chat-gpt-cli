export const LINE_SEP = '\r';
export const SPACE = ' ';

export function isNullable(x: unknown): x is undefined | null {
	return x == null;
}

export const nop = () => undefined;

export function replaceLineSep(value: string): string {
	return value.replace(/\n/g, LINE_SEP);
}

export function toLines(value: string): string[] {
	return value.split(LINE_SEP);
}
