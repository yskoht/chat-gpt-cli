import {Box, Text} from 'ink';
import React from 'react';

type Props = {
	label: string;
};

function ChatRecord({label}: Props) {
	return (
		<Box>
			<Text>* {label}</Text>
		</Box>
	);
}

export default ChatRecord;
