export const FOCUS_COLOR = 'green';

export function getFocusColor(isFocused: boolean): string | undefined {
	return isFocused ? FOCUS_COLOR : undefined;
}
