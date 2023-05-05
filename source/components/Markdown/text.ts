import {ELEMENT_KIND} from './constants.js';
import {TextElement} from './types.js';

export function create(value: string): TextElement {
	return {
		kind: ELEMENT_KIND.text,
		value,
	};
}
