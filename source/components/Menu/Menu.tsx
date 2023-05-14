import {Box, useFocus} from 'ink';
import React from 'react';

import Divider from '@/components/Divider/index.js';
import ScrollArea from '@/components/ScrollArea/ScrollArea.js';
import {FOCUS_ID} from '@/hooks/useFocusManagement.js';
import * as styles from '@/styles/index.js';

import ChatRecordList from './ChatRecordList.js';
import NewChat from './NewChat.js';
import useInputHandler from './useInputHandler.js';

type Props = {
	id: string;
};
function Menu({id}: Props) {
	const {isFocused} = useFocus({id: FOCUS_ID.menu});
	const borderColor = styles.getFocusColor(isFocused);

	useInputHandler({isActive: isFocused});

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
				<NewChat id={id} />
				<Divider />
			</Box>

			<ScrollArea isActive={isFocused} height="100%">
				<ChatRecordList id={id} />
			</ScrollArea>
		</Box>
	);
}

export default Menu;
