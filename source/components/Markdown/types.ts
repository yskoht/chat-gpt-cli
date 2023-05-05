import {ELEMENT_KIND} from './constants.js';

export type TextElement = {
	kind: typeof ELEMENT_KIND.text;
	value: string;
};

export type TableData = Record<string, string>;

export type TableElement = {
	kind: typeof ELEMENT_KIND.table;
	value: {
		header: string[];
		data: TableData[];
	};
};

export type Element = TextElement | TableElement;
