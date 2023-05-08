import {Box, Text} from 'ink';
import React, {useMemo} from 'react';

import useChatRecordList from './useChatRecordList.js';

type ChatRecordProps = {
	label: string;
};

function ChatRecord({label}: ChatRecordProps) {
	return (
		<Box>
			<Text wrap="truncate">* {label}</Text>
		</Box>
	);
}

function ChatRecordList() {
	const {list} = useChatRecordList();

	const records = useMemo(
		() => list.map(({id, title}) => <ChatRecord key={id} label={title} />),
		[list],
	);

	return <Box flexDirection="column">{records}</Box>;
}

export default ChatRecordList;
