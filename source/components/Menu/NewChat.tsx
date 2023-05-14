import {Text} from 'ink';
import React, {useMemo} from 'react';

import useChatRecord from '@/hooks/useChatRecord.js';

import {SELECTED_CHAT_RECORD_COLOR} from './constants.js';

type Props = {
	id: string;
};
function NewChat({id}: Props) {
	const {isNewChat} = useChatRecord(({isNewChat}) => ({
		isNewChat,
	}));

	const isSelected = isNewChat(id);
	const color = useMemo(
		() => (isSelected ? SELECTED_CHAT_RECORD_COLOR : undefined),
		[isSelected],
	);

	return (
		<Text color={color} wrap="truncate">
			+ New chat
		</Text>
	);
}

export default NewChat;
