import {useInput} from 'ink';

import useChatRecord from '@/hooks/useChatRecord.js';

type Props = {
	isActive: boolean;
};

function useInputHandler({isActive}: Props) {
	const {moveIdToNext, moveIdToPrev} = useChatRecord(
		({moveIdToNext, moveIdToPrev}) => ({
			moveIdToNext,
			moveIdToPrev,
		}),
	);

	useInput(
		(_, key) => {
			if (key.downArrow) {
				moveIdToNext();
				return;
			}

			if (key.upArrow) {
				moveIdToPrev();
				return;
			}
		},
		{isActive},
	);
}

export default useInputHandler;
