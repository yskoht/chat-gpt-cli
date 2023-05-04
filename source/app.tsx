import {Box} from 'ink';
import React from 'react';

import Chat from '@/components/Chat/index.js';
import ChatRecord from '@/components/ChatRecord/index.js';
import Divider from '@/components/Divider/index.js';
import NewChat from '@/components/NewChat/index.js';
import ScrollArea from '@/components/ScrollArea/index.js';
import useController from '@/hooks/useController.js';
import useDimension from '@/hooks/useDimension.js';

export default function App() {
	const {width, height} = useDimension();
	useController();

	return (
		<Box
			flexDirection="row"
			justifyContent="space-between"
			width={width}
			height={height}
		>
			<Box borderStyle="single" width="80%" paddingLeft={1} paddingRight={1}>
				<ScrollArea>
					<Chat />
				</ScrollArea>
			</Box>

			<Box flexDirection="column" width="20%" borderStyle="single">
				<NewChat />
				<Divider paddingLeft={1} paddingRight={1} />
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
