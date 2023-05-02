import React from 'react';
import {Box} from 'ink';

import NewChat from './NewChat.js';
import ChatRecord from './ChatRecord.js';
import Chat from './Chat.js';

import useController from './useController.js';

export default function App() {
	useController();

	return (
		<Box flexDirection="row" justifyContent="space-between">
			<Box
				flexDirection="column"
				justifyContent="flex-end"
				borderStyle="single"
				width="80%"
				paddingLeft={1}
				paddingRight={1}
			>
				<Chat />
			</Box>

			<Box flexDirection="column" width="20%">
				<Box flexDirection="column" borderStyle="single">
					<NewChat />
				</Box>
				<Box flexDirection="column" borderStyle="single">
					<ChatRecord label="Hello1" />
					<ChatRecord label="Hello2" />
					<ChatRecord label="Hello3" />
					<ChatRecord label="Hello4" />
				</Box>
			</Box>
		</Box>
	);
}
