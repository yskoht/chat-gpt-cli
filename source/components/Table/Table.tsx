import {Text, Box} from 'ink';
import React from 'react';

type Data = Record<string, string | number>;
type Props = {
	value: {
		header: string[];
		data: Data[];
	};
};

function buildHeader(header: string[]) {
	const keyExtractor = (item: string, i: number) => `header-${i}-${item}`;

	const items = header.map((item, i) => {
		const key = keyExtractor(item, i);
		return (
			<Box
				key={key}
				marginRight={1}
				paddingLeft={1}
				paddingRight={1}
				width={20}
				justifyContent="center"
				borderTop={false}
				borderLeft={false}
				borderRight={false}
				borderBottom={false}
				borderStyle="single"
			>
				<Text underline>{item}</Text>
			</Box>
		);
	});

	return (
		<Box
			flexDirection="row"
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

function buildRow(header: string[], row: Data, rowIndex: number) {
	const keyExtractor = (item: string, i: number) =>
		`item-${rowIndex}-${i}-${item}`;

	return header.map((item, i) => {
		const key = keyExtractor(item, i);
		return (
			<Box
				key={key}
				marginRight={1}
				paddingLeft={1}
				paddingRight={1}
				width={20}
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

function buildBody(header: string[], data: Data[]) {
	const keyExtractor = (rowIndex: number) => `row-${rowIndex}`;

	const _rows = data.map((row, rowIndex) => {
		const _row = buildRow(header, row, rowIndex);

		const key = keyExtractor(rowIndex);
		return (
			<Box
				key={key}
				flexDirection="row"
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

function Table({value: {header, data}}: Props) {
	const _header = buildHeader(header);
	const _body = buildBody(header, data);

	return (
		<Box flexDirection="column">
			{_header}
			{_body}
		</Box>
	);
}

export default Table;
