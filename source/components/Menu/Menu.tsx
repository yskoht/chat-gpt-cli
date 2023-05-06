import {Box, useFocus} from 'ink';
import React from 'react';

import ChatRecord from '@/components/ChatRecord/index.js';
import Divider from '@/components/Divider/index.js';
import NewChat from '@/components/NewChat/index.js';

function Menu() {
	useFocus();
	return (
		<Box
			flexDirection="column"
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
	);
}

export default Menu;
