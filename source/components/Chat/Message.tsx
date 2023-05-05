import {Box} from 'ink';
import React, {ReactNode} from 'react';

import Markdown from '@/components/Markdown/index.js';

import Mark from './Mark.js';
import {DEFAULT_MESSAGE_MARK_COLOR} from './constants.js';

type Props = {
	value: string;
	mark: ReactNode;
	markColor?: string;
	enableSyntaxHighlight?: boolean;
	enableTabulation: boolean;
};
function Message({
	value,
	mark,
	markColor = DEFAULT_MESSAGE_MARK_COLOR,
	enableSyntaxHighlight = true,
	enableTabulation,
}: Props) {
	return (
		<Box flexDirection="row">
			<Mark mark={mark} markColor={markColor} />
			<Box marginLeft={1}>
				<Markdown
					value={value}
					enableSyntaxHighlight={enableSyntaxHighlight}
					enableTabulation={enableTabulation}
				/>
			</Box>
		</Box>
	);
}

export default Message;
