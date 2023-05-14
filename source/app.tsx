import {Box} from 'ink';
import React from 'react';

import Chat from '@/components/Chat/index.js';
import Menu from '@/components/Menu/index.js';
import StatusBar from '@/components/StatusBar/index.js';
import useChatRecord from '@/hooks/useChatRecord.js';
import useDimension from '@/hooks/useDimension.js';
import useFocusManagement from '@/hooks/useFocusManagement.js';

const CHAT_WIDTH_PERCENTAGE = 80;
const MENU_WIDTH_PERCENTAGE = 100 - CHAT_WIDTH_PERCENTAGE;

const CHAT_WIDTH = toWidth(CHAT_WIDTH_PERCENTAGE);
const MENU_WIDTH = toWidth(MENU_WIDTH_PERCENTAGE);

export default function App() {
	useFocusManagement();

	const {width, height} = useDimension();
	const id = useChatRecord(({id}) => id);

	return (
		<Box flexDirection="column">
			<Box width={width} height={height - 1}>
				<Box width={CHAT_WIDTH}>
					<Chat id={id} />
				</Box>

				<Box width={MENU_WIDTH}>
					<Menu id={id} />
				</Box>
			</Box>

			<StatusBar />
		</Box>
	);
}

function toWidth(percentage: number): string {
	return `${percentage}%`;
}
