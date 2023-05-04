export function isNullable(x: unknown): x is undefined | null {
	return x == null;
}
export const nop = () => undefined;

export const LINE_SEP = '\r';
export const SPACE = ' ';
