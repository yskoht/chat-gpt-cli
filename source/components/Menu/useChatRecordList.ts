import {useMemo} from 'react';

import useChatRecord from '@/hooks/useChatRecord.js';

function useChatRecordList() {
	const {getIdList, chatRecord} = useChatRecord(({getIdList, chatRecord}) => ({
		getIdList,
		chatRecord,
	}));

	const list = useMemo(() => {
		const keys = getIdList();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return keys.map((id) => chatRecord[id]!);
	}, [chatRecord, getIdList]);

	return useMemo(
		() => ({
			list,
		}),
		[list],
	);
}

export default useChatRecordList;
