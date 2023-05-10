import {useInput} from 'ink';

import useChatRecord from '@/hooks/useChatRecord.js';

type Props = {
	isActive: boolean;
};

function useInputHandler({isActive}: Props) {
	const {moveIdToNext, moveIdToPrev, moveIdToNew, moveIdToNth} = useChatRecord(
		({moveIdToNext, moveIdToPrev, moveIdToNew, moveIdToNth}) => ({
			moveIdToNext,
			moveIdToPrev,
			moveIdToNew,
			moveIdToNth,
		}),
	);

	useInput(
		(input, key) => {
			if (key.shift && key.downArrow) {
				// ignore
				return;
			}

			if (key.shift && key.upArrow) {
				// ignore
				return;
			}

			if (key.ctrl && key.downArrow) {
				// ignore
				return;
			}

			if (key.ctrl && key.upArrow) {
				// ignore
				return;
			}

			if (key.downArrow || input === 'j') {
				moveIdToNext();
				return;
			}

			if (key.upArrow || input === 'k') {
				moveIdToPrev();
				return;
			}

			if (input === '0') {
				moveIdToNew();
				return;
			}

			if (
				input === '1' ||
				input === '2' ||
				input === '3' ||
				input === '4' ||
				input === '5' ||
				input === '6' ||
				input === '7' ||
				input === '8' ||
				input === '9'
			) {
				moveIdToNth(parseInt(input, 10));
				return;
			}
		},
		{isActive},
	);
}

export default useInputHandler;
