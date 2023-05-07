import {useMemo} from 'react';

import useChatRecord from '@/hooks/useChatRecord.js';

function useChatRecordList() {
	const {chatRecord} = useChatRecord(({chatRecord}) => ({
		chatRecord,
	}));

	const list = useMemo(() => {
		const keys = Object.keys(chatRecord).sort().reverse();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return keys.map((id) => chatRecord[id]!);
	}, [chatRecord]);

	return useMemo(
		() => ({
			list,
		}),
		[list],
	);
}

export default useChatRecordList;
