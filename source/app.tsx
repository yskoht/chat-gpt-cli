import {Box} from 'ink';
import React from 'react';

import Chat from '@/components/Chat/index.js';
import ChatRecord from '@/components/ChatRecord/index.js';
import NewChat from '@/components/NewChat/index.js';
import useController from '@/hooks/useController.js';

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
