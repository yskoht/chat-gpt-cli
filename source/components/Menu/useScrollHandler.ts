import {useEffect, useMemo} from 'react';

import useScrollArea from '@/components/ScrollArea/useScrollArea.js';
import useChatRecord from '@/hooks/useChatRecord.js';
import useDimension from '@/hooks/useDimension.js';

function getIdIndex(idList: string[], id: string): number {
	return idList.indexOf(id);
}

function indexNotFound(id: number): boolean {
	return id === -1;
}

type Range = {
	top: number;
	bottom: number;
};

function getDisplayedRange(
	positionFromInnerTop: number,
	outerHeight: number,
): Range {
	const top = positionFromInnerTop;
	const bottom = top + outerHeight;
	return {top, bottom};
}

function isIdIndexDisplayed(idIndex: number, {top, bottom}: Range): boolean {
	return top <= idIndex && idIndex < bottom;
}

function useScrollHandler(id: string) {
	const {getIdList, isNewChat} = useChatRecord(({getIdList, isNewChat}) => ({
		getIdList,
		isNewChat,
	}));

	const {
		resize,
		outerHeight,
		positionFromInnerTop,
		scrollDown,
		scrollUp,
		scrollToTop,
	} = useScrollArea();

	const {width, height} = useDimension();
	useEffect(resize, [resize, width, height]);

	const idList = getIdList();
	const idIndex = useMemo(() => getIdIndex(idList, id), [idList, id]);
	if (indexNotFound(idIndex)) {
		if (isNewChat(id) && positionFromInnerTop !== 0) {
			scrollToTop();
		}
		return;
	}

	const displayRange = useMemo(
		() => getDisplayedRange(positionFromInnerTop, outerHeight),
		[positionFromInnerTop, outerHeight],
	);
	const isDisplayed = useMemo(
		() => isIdIndexDisplayed(idIndex, displayRange),
		[idIndex, displayRange],
	);
	if (isDisplayed) {
		return;
	}

	if (idIndex < displayRange.top) {
		const diff = displayRange.top - idIndex;
		scrollUp(diff);
		return;
	}

	if (displayRange.bottom <= idIndex) {
		const diff = idIndex - displayRange.bottom + 1;
		scrollDown(diff);
		return;
	}
}

export default useScrollHandler;
