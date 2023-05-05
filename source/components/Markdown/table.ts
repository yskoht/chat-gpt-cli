import {isNullable} from '@/utilities/index.js';

import {ELEMENT_KIND} from './constants.js';
import {TableElement} from './types.js';

const _TABLE_HEADER_REGEXP = `(?<header>\\|(.+\\|)+)\\n`;
const _TABLE_SEPARATOR_REGEXP = `\\|(\\s*:?-+:?\\s*\\|)+\\n`;
const _TABLE_BODY = `(?<body>(\\|(.+\\|)+\\n?)+)`;
export const _TABLE_REGEXP = `(?<table>${_TABLE_HEADER_REGEXP}${_TABLE_SEPARATOR_REGEXP}${_TABLE_BODY})`;

type Groups = {
	header: string | undefined;
	body: string | undefined;
};

function parseRow(row: string): string[] {
	const items = row.split('|');
	const trimmedItems = items.map((item) => item.trim());
	const filteredItems = trimmedItems.filter((item) => !!item);
	return filteredItems;
}

function parseHeader(header: string): string[] {
	return parseRow(header);
}

function parseBody(
	_body: string,
	headerItems: string[],
): Record<string, string>[] {
	const rows = _body.split('\n').filter((row) => !!row);
	const body = rows.map(parseRow);

	const data = body.map((row) =>
		headerItems.reduce(
			(acc, cur, i) => ({...acc, [cur]: row[i] || ''}),
			{} as Record<string, string>,
		),
	);
	return data;
}

function create(header: string[], data: Record<string, string>[]) {
	return {
		kind: ELEMENT_KIND.table,
		value: {
			header,
			data,
		},
	};
}

export function parseTable(markdown: string): TableElement {
	const regexp = new RegExp(_TABLE_REGEXP, 'g');
	const m = regexp.exec(markdown);
	const {header, body} = m?.groups as Groups;
	if (isNullable(m) || isNullable(header) || isNullable(body)) {
		throw new Error();
	}

	const _header = parseHeader(header);
	const data = parseBody(body, _header);
	return create(_header, data);
}
