import {Box, Text} from 'ink';
import React, {useMemo} from 'react';

import {SELECTED_CHAT_RECORD_COLOR} from './constants.js';
import useChatRecordList from './useChatRecordList.js';

type ChatRecordProps = {
	label: string;
	isSelected: boolean;
};
function ChatRecord({label, isSelected}: ChatRecordProps) {
	const color = useMemo(
		() => (isSelected ? SELECTED_CHAT_RECORD_COLOR : undefined),
		[isSelected],
	);

	return (
		<Text color={color} wrap="truncate">
			* {label}
		</Text>
	);
}

type Props = {
	id: string;
};
function ChatRecordList({id}: Props) {
	const {list} = useChatRecordList();

	const records = useMemo(
		() =>
			list.map(({id: recordId, title}) => (
				<ChatRecord key={recordId} label={title} isSelected={recordId === id} />
			)),
		[list, id],
	);

	return <Box flexDirection="column">{records}</Box>;
}

export default ChatRecordList;
