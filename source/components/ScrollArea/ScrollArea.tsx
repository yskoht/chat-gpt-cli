import React from 'react';

import InnerBox from './InnerBox.js';
import OuterBox from './OuterBox.js';
import ScrollAreaContextProvider from './ScrollAreaContext.js';
import ScrollHandler from './ScrollHandler.js';
import {SCROLL_BAR_VISIBILITY} from './constants.js';
import {ScrollBarVisibility} from './types.js';

type Props = {
	children: React.ReactNode;
	height?: number | string;
	isActive?: boolean;
	scrollBar?: ScrollBarVisibility;
};
function ScrollArea({
	children,
	height,
	isActive = true,
	scrollBar = SCROLL_BAR_VISIBILITY.auto,
}: Props) {
	return (
		<ScrollAreaContextProvider>
			<ScrollHandler isActive={isActive} />
			<OuterBox height={height} scrollBar={scrollBar}>
				<InnerBox>{children}</InnerBox>
			</OuterBox>
		</ScrollAreaContextProvider>
	);
}

export default ScrollArea;
