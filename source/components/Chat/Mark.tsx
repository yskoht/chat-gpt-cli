import React from 'react';
import {Text} from 'ink';

import {Message} from './hooks/types.js';
import {
	USER_MESSAGE_MARK_COLOR,
	ASSISTANT_MESSAGE_MARK_COLOR,
	DEFAULT_MESSAGE_MARK_COLOR,
} from './hooks/constants.js';

type Props = {
	mark: string;
	markColor: string;
};
function Mark({mark, markColor}: Props) {
	return <Text color={markColor}>{mark}</Text>;
}

export default Mark;

export function markColor(message: Message) {
	switch (message.role) {
		case 'user':
			return USER_MESSAGE_MARK_COLOR;
		case 'assistant':
			return ASSISTANT_MESSAGE_MARK_COLOR;
		default:
			return DEFAULT_MESSAGE_MARK_COLOR;
	}
}
