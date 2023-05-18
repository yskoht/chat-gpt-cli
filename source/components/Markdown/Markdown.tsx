import {Box} from 'ink';
import React from 'react';

import MultiLineTextInput from '@/components/MultiLineTextInput/index.js';
import Table from '@/components/Table/index.js';
import {nop} from '@/utilities/index.js';
import {assertNever, isNullable} from '@/utilities/index.js';

import * as table from './table.js';
import * as text from './text.js';
import {Element} from './types.js';

type Groups = {
	table: string | undefined;
};

function tableFound(groups: Groups): groups is Groups & {table: string} {
	return !isNullable(groups.table);
}

function sliceAfterValue(value: string, index: number, found: string): string {
	return value.slice(index + found.length);
}

function sliceBeforeValue(value: string, index: number): string {
	return value.slice(0, index);
}

function toTextElements(value: string): Element[] {
	if (value.length === 0) {
		return [];
	}
	return [text.create(value)];
}

function categorize(valueOrg: string, enableTabulation: boolean): Element[] {
	if (!enableTabulation) {
		return toTextElements(valueOrg);
	}

	const _REGEXP = `${table._TABLE_REGEXP}`;
	const regexp = new RegExp(_REGEXP, 'g');
	const ms = [...valueOrg.matchAll(regexp)];

	const rest = ms.reduceRight(
		(acc, m) => {
			if (isNullable(m.index)) {
				return acc;
			}

			const {value, elements} = acc;

			const groups = m.groups as Groups;
			if (tableFound(groups)) {
				const markdownTable = groups.table;
				const afterValue = sliceAfterValue(value, m.index, markdownTable);
				const beforeValue = sliceBeforeValue(value, m.index);
				const tableElement = table.parseTable(markdownTable);

				return {
					value: beforeValue,
					elements: [tableElement, ...toTextElements(afterValue), ...elements],
				};
			}

			return acc;
		},
		{value: valueOrg, elements: [] as Element[]},
	);

	return [...toTextElements(rest.value), ...rest.elements];
}

function keyExtractor(kind: string, index: number): string {
	return `${index}-${kind}`;
}

type Props = {
	value: string;
	enableSyntaxHighlight?: boolean;
	enableTabulation?: boolean;
};
function Markdown({
	value,
	enableSyntaxHighlight = true,
	enableTabulation = true,
}: Props) {
	const _elements = categorize(value, enableTabulation);

	const elements = _elements.map((element, i) => {
		const key = keyExtractor(element.kind, i);
		switch (element.kind) {
			case 'text':
				return (
					<MultiLineTextInput
						key={key}
						value={element.value}
						onChange={nop}
						onSubmit={nop}
						showCursor={false}
						isActive={false}
						enableSyntaxHighlight={enableSyntaxHighlight}
					/>
				);
			case 'table':
				return <Table key={key} value={element.value} />;
			default:
				assertNever(element);
		}
	});

	return <Box flexDirection="column">{elements}</Box>;
}

export default React.memo(Markdown);
