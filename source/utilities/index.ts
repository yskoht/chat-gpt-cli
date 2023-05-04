export function isNullable(x: unknown): x is undefined | null {
	return x == null;
}
