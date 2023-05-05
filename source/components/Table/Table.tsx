import {Text, Box, measureElement} from 'ink';
import React, {useRef, useEffect, useState, useMemo} from 'react';

import {isNullable} from '@/utilities/index.js';

const PADDING_LEFT = 1;
const PADDING_RIGHT = 1;

type Data = Record<string, string>;
type ColumnWidth = Record<string, number>;

function buildHeader(header: string[], columnWidth: ColumnWidth) {
	const keyExtractor = (item: string, i: number) => `header-${i}-${item}`;

	const items = header.map((item, i) => {
		const key = keyExtractor(item, i);
		return (
			<Box
				key={key}
				paddingLeft={PADDING_LEFT}
				paddingRight={PADDING_RIGHT}
				width={columnWidth[item]}
				borderTop={false}
				borderLeft={false}
				borderRight={false}
				borderBottom={false}
				borderStyle="single"
			>
				<Text bold>{item}</Text>
			</Box>
		);
	});

	return (
		<Box
			borderTop={false}
			borderLeft={false}
			borderRight={false}
			borderBottom
			borderStyle="single"
		>
			{items}
		</Box>
	);
}

function buildRow(
	header: string[],
	row: Data,
	rowIndex: number,
	columnWidth: ColumnWidth,
) {
	const keyExtractor = (item: string, i: number) =>
		`item-${rowIndex}-${i}-${item}`;

	return header.map((item, i) => {
		const key = keyExtractor(item, i);
		return (
			<Box
				key={key}
				paddingLeft={PADDING_LEFT}
				paddingRight={PADDING_RIGHT}
				width={columnWidth[item]}
				borderTop={false}
				borderLeft={false}
				borderRight={false}
				borderBottom={false}
				borderStyle="single"
			>
				<Text>{row[item]}</Text>
			</Box>
		);
	});
}

function buildBody(header: string[], data: Data[], columnWidth: ColumnWidth) {
	const keyExtractor = (rowIndex: number) => `row-${rowIndex}`;

	const _rows = data.map((row, rowIndex) => {
		const _row = buildRow(header, row, rowIndex, columnWidth);

		const key = keyExtractor(rowIndex);
		return (
			<Box
				key={key}
				borderTop={false}
				borderLeft={false}
				borderRight={false}
				borderBottom
				borderStyle="single"
			>
				{_row}
			</Box>
		);
	});

	return <Box flexDirection="column">{_rows}</Box>;
}

function calcColumnWidth(header: string[], data: Data[], width: number) {
	const val = (v: number | undefined): number => v ?? 0;
	const PADDING = PADDING_LEFT + PADDING_RIGHT + 1;

	const columnWidthMax = header.reduce((acc, item) => {
		const _columnWidthMax = data.reduce((a, d) => {
			return Math.max(a, val(d[item]?.length) + PADDING);
		}, item.length + PADDING);

		return {...acc, [item]: _columnWidthMax};
	}, {} as ColumnWidth);

	const columnWidthMaxSum = header.reduce((acc, item) => {
		return acc + val(columnWidthMax[item]);
	}, 0);

	const columnWidth = header.reduce((acc, item) => {
		return {
			...acc,
			[item]: (val(columnWidthMax[item]) / columnWidthMaxSum) * width,
		};
	}, {});

	return columnWidth;
}

type Props = {
	width?: number;
	minWidth?: number;
	value: {
		header: string[];
		data: Data[];
	};
};

function Table({width, minWidth, value: {header, data}}: Props) {
	const ref = useRef(null);
	const [columnWidth, setColumnWidth] = useState<ColumnWidth>({});

	useEffect(() => {
		if (isNullable(ref.current)) {
			return;
		}
		const {width} = measureElement(ref.current);
		const _columnWidth = calcColumnWidth(header, data, width);
		setColumnWidth(_columnWidth);
	}, [header, data]);

	const _header = useMemo(
		() => buildHeader(header, columnWidth),
		[header, columnWidth],
	);
	const _body = useMemo(
		() => buildBody(header, data, columnWidth),
		[header, data, columnWidth],
	);

	return (
		<Box
			ref={ref}
			minWidth={minWidth}
			width={width}
			flexDirection="column"
			justifyContent="center"
		>
			{_header}
			{_body}
		</Box>
	);
}

export default Table;
