import {Box} from 'ink';
import React from 'react';

import Chat from '@/components/Chat/index.js';
import Menu from '@/components/Menu/index.js';
import useDimension from '@/hooks/useDimension.js';
import useFocusManagement from '@/hooks/useFocusManagement.js';

const CHAT_WIDTH_PERCENTAGE = 80;
const MENU_WIDTH_PERCENTAGE = 100 - CHAT_WIDTH_PERCENTAGE;

const CHAT_WIDTH = `${CHAT_WIDTH_PERCENTAGE}%`;
const MENU_WIDTH = `${MENU_WIDTH_PERCENTAGE}%`;

export default function App() {
	const {width, height} = useDimension();
	useFocusManagement();

	return (
		<Box justifyContent="space-between" width={width} height={height}>
			<Box width={CHAT_WIDTH}>
				<Chat />
			</Box>

			<Box width={MENU_WIDTH}>
				<Menu />
			</Box>
		</Box>
	);
}
