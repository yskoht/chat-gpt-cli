import React from 'react';

import InnerBox from './InnerBox.js';
import OuterBox from './OuterBox.js';
import ScrollAreaContextProvider from './ScrollAreaContext.js';
import ScrollHandler from './ScrollHandler.js';
import {SCROLL_BAR_VISIBILITY} from './constants.js';
import {
	ScrollBarVisibility,
	ScrollHandler as ScrollHandlerType,
} from './types.js';

type Props = {
	children: React.ReactNode;
	height?: number | string;
	isActive?: boolean;
	scrollBarVisibility?: ScrollBarVisibility;
	scrollBarColor?: string;
	scrollHandler?: ScrollHandlerType;
};
function ScrollArea({
	children,
	height,
	isActive = true,
	scrollBarVisibility = SCROLL_BAR_VISIBILITY.auto,
	scrollBarColor,
	scrollHandler,
}: Props) {
	return (
		<ScrollAreaContextProvider>
			<ScrollHandler isActive={isActive} scrollHandler={scrollHandler} />
			<OuterBox
				height={height}
				scrollBarVisibility={scrollBarVisibility}
				scrollBarColor={scrollBarColor}
			>
				<InnerBox>{children}</InnerBox>
			</OuterBox>
		</ScrollAreaContextProvider>
	);
}

export default ScrollArea;
