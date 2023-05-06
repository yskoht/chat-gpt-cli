import {Box, useFocus} from 'ink';
import React from 'react';

import ChatRecord from '@/components/ChatRecord/index.js';
import Divider from '@/components/Divider/index.js';
import NewChat from '@/components/NewChat/index.js';
import {FOCUS_ID} from '@/hooks/useFocusManagement.js';
import * as styles from '@/styles/index.js';

function Menu() {
	const {isFocused} = useFocus({id: FOCUS_ID.menu});
	const borderColor = styles.getFocusColor(isFocused);
	return (
		<Box
			flexDirection="column"
			borderStyle="single"
			borderColor={borderColor}
			width="100%"
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
