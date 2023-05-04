export function isNullable(x: unknown): x is undefined | null {
	return x == null;
}

export const SPACE = ' ';

export const nop = () => undefined;
