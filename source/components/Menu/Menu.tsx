import {Box, useFocus} from 'ink';
import React from 'react';

import Divider from '@/components/Divider/index.js';
import NewChat from '@/components/NewChat/index.js';
import ScrollArea from '@/components/ScrollArea/ScrollArea.js';
import {FOCUS_ID} from '@/hooks/useFocusManagement.js';
import * as styles from '@/styles/index.js';

import ChatRecordList from './ChatRecordList.js';

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
			<Box flexDirection="column" flexShrink={0} flexGrow={0}>
				<NewChat />
				<Divider />
			</Box>

			<ScrollArea isActive={isFocused}>
				<ChatRecordList />
			</ScrollArea>
		</Box>
	);
}

export default Menu;
