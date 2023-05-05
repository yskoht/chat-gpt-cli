import {Box} from 'ink';
import React, {ReactNode} from 'react';

import MultiLineTextInput, {
	OnHistory,
} from '@/components/MultiLineTextInput/index.js';

import Mark from './Mark.js';
import {DEFAULT_MESSAGE_MARK_COLOR} from './constants.js';

type Props = {
	value: string;
	mark: ReactNode;
	markColor?: string;
	onChange: (value: string) => void;
	onSubmit: (value: string) => void;
	showCursor?: boolean;
	isActive?: boolean;
	onHistoryPrev: OnHistory;
	onHistoryNext: OnHistory;
};
function UserPrompt({
	value,
	mark,
	markColor = DEFAULT_MESSAGE_MARK_COLOR,
	onChange,
	onSubmit,
	showCursor = true,
	isActive = true,
	onHistoryPrev,
	onHistoryNext,
}: Props) {
	return (
		<Box>
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
					enableSyntaxHighlight={false}
				/>
			</Box>
		</Box>
	);
}

export default UserPrompt;
