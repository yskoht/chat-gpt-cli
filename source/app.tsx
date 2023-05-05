import {Box} from 'ink';
import React from 'react';

import Chat from '@/components/Chat/index.js';
import ChatRecord from '@/components/ChatRecord/index.js';
import Divider from '@/components/Divider/index.js';
import NewChat from '@/components/NewChat/index.js';
import useDimension from '@/hooks/useDimension.js';
import useFocusManagement from '@/hooks/useFocusManagement.js';

const CHAT_WIDTH_PERCENTAGE = 80;
const CHAT_RECORD_WIDTH_PERCENTAGE = 100 - CHAT_WIDTH_PERCENTAGE;

export default function App() {
	const {width, height} = useDimension();
	useFocusManagement();

	return (
		<Box justifyContent="space-between" width={width} height={height}>
			<Box width={`${CHAT_WIDTH_PERCENTAGE}%`}>
				<Chat />
			</Box>

			<Box
				flexDirection="column"
				width={`${CHAT_RECORD_WIDTH_PERCENTAGE}%`}
				borderStyle="single"
				paddingLeft={1}
				paddingRight={1}
			>
				<NewChat />
				<Divider />
				<Box flexDirection="column">
					<ChatRecord label="Hello1" />
					<ChatRecord label="Hello2" />
					<ChatRecord label="Hello3" />
					<ChatRecord label="Hello4" />
				</Box>
			</Box>
		</Box>
	);
}
