import {Box} from 'ink';
import React from 'react';

import MultiLineTextInput from '@/components/MultiLineTextInput/index.js';

import Mark from './Mark.js';

const nop = () => undefined;

type Props = {
	value: string;
	mark: string;
	markColor?: string;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	showCursor?: boolean;
	isActive?: boolean;
};
function Message({
	value,
	mark,
	markColor = 'gray',
	onChange = nop,
	onSubmit = nop,
	showCursor = false,
	isActive = false,
}: Props) {
	return (
		<Box flexDirection="row">
			<Mark mark={mark} markColor={markColor} />
			<Box marginLeft={1}>
				<MultiLineTextInput
					value={value}
					onChange={onChange}
					onSubmit={onSubmit}
					showCursor={showCursor}
					isActive={isActive}
				/>
			</Box>
		</Box>
	);
}

export default Message;
