import {highlight} from 'cli-highlight';
import urlRegexSafe from 'url-regex-safe';

import {isNullable} from '@/utilities/index.js';

const CODE_BLOCK_REGEXP =
	'(?<codeBlockAll>`{3}(?<codeBlockLanguage>\\w*)\\r?(?<codeBlock>[\\s\\S]*?)`{3}\\r?)';
const UNFINISHED_CODE_BLOCK_REGEXP =
	'(?<unfinishedCodeBlockAll>`{3}(?<unfinishedLanguage>\\w*)\\r?(?<unfinishedCodeBlock>[\\s\\S]*?)$)';
const CODE_LINE_REGEXP = '(?<codeLineAll>`(?<codeLine>[^`]+)`)';

const CODE_REGEXP = new RegExp(
	`${CODE_BLOCK_REGEXP}|${UNFINISHED_CODE_BLOCK_REGEXP}|${CODE_LINE_REGEXP}`,
	'g',
);
const URL_REGEXP = urlRegexSafe({strict: true});

type Groups = {
	codeBlockAll: string | undefined;
	codeBlock: string | undefined;
	codeBlockLanguage: string | undefined;

	unfinishedCodeBlockAll: string | undefined;
	unfinishedCodeBlock: string | undefined;
	unfinishedCodeBlockLanguage: string | undefined;

	codeLineAll: string | undefined;
	codeLine: string | undefined;
};

function replaceValue(
	value: string,
	index: number,
	beforeValue: string,
	afterValue: string,
) {
	return (
		value.slice(0, index) + afterValue + value.slice(index + beforeValue.length)
	);
}

function colorizeCodeBlock(
	value: string,
	index: number,
	codeBlockAll: string,
	codeBlock: string,
	language: string | undefined,
) {
	const highlighted = highlight(codeBlock, {language});
	return replaceValue(value, index, codeBlockAll, highlighted);
}

function colorizeCodeLine(
	value: string,
	index: number,
	codeLineAll: string,
	codeLine: string,
) {
	const highlighted = `\x1B[1m${codeLine}\x1B[22m`; // tmp
	return replaceValue(value, index, codeLineAll, highlighted);
}

function colorizeUrl(value: string, index: number, url: string) {
	const highlighted = `\x1b[38;2;255;105;180m${url}\x1b[0m`; // tmp
	return replaceValue(value, index, url, highlighted);
}

export function highlightCode(value: string): string {
	const ms = [...value.matchAll(CODE_REGEXP)];

	return ms.reduceRight((acc, m) => {
		if (isNullable(m.index)) {
			return acc;
		}

		const {
			codeBlockAll,
			codeBlock,
			codeBlockLanguage,

			unfinishedCodeBlockAll,
			unfinishedCodeBlock,
			unfinishedCodeBlockLanguage,

			codeLineAll,
			codeLine,
		} = m.groups as Groups;

		if (codeBlockAll && codeBlock) {
			return colorizeCodeBlock(
				acc,
				m.index,
				codeBlockAll,
				codeBlock,
				codeBlockLanguage,
			);
		}

		if (unfinishedCodeBlockAll && unfinishedCodeBlock) {
			return colorizeCodeBlock(
				acc,
				m.index,
				unfinishedCodeBlockAll,
				unfinishedCodeBlock,
				unfinishedCodeBlockLanguage,
			);
		}

		if (codeLineAll && codeLine) {
			return colorizeCodeLine(acc, m.index, codeLineAll, codeLine);
		}

		return acc;
	}, value);
}

export function highlightUrl(value: string): string {
	const ms = [...value.matchAll(URL_REGEXP)];

	return ms.reduceRight((acc, m) => {
		const [url] = m;

		if (isNullable(m.index)) {
			return acc;
		}
		return colorizeUrl(acc, m.index, url);
	}, value);
}
