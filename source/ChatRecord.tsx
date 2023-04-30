import React from 'react';
import {Box, Text, useFocus} from 'ink';

type Props = {
	label: string;
};

function ChatRecord({label}: Props) {
	const {isFocused} = useFocus();

	return (
		<Box paddingLeft={1}>
			<Text color={isFocused ? 'green' : 'white'}>* {label}</Text>
		</Box>
	);
}

export default ChatRecord;
