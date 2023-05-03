export function isNullable(
	x: string | undefined | null,
): x is undefined | null {
	return x == null;
}
