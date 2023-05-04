import {Box} from 'ink';
import React, {ReactNode} from 'react';

import MultiLineTextInput, {
	OnHistory,
} from '@/components/MultiLineTextInput/index.js';
import {nop} from '@/utilities/index.js';

import Mark from './Mark.js';

const DEFAULT_MARK_COLOR = 'gray';

type Props = {
	value: string;
	mark: ReactNode;
	markColor?: string;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	showCursor?: boolean;
	isActive?: boolean;
	onHistoryPrev?: OnHistory;
	onHistoryNext?: OnHistory;
	enableSyntaxHighlight?: boolean;
};
function Message({
	value,
	mark,
	markColor = DEFAULT_MARK_COLOR,
	onChange = nop,
	onSubmit = nop,
	showCursor = false,
	isActive = false,
	onHistoryPrev,
	onHistoryNext,
	enableSyntaxHighlight = true,
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
					onHistoryPrev={onHistoryPrev}
					onHistoryNext={onHistoryNext}
					enableSyntaxHighlight={enableSyntaxHighlight}
				/>
			</Box>
		</Box>
	);
}

export default Message;
