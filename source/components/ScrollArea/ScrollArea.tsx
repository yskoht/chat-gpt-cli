import React from 'react';

import InnerBox from './InnerBox.js';
import OuterBox from './OuterBox.js';
import ScrollAreaContextProvider from './ScrollAreaContext.js';
import ScrollController from './ScrollController.js';

type Props = {
	children: React.ReactNode;
	height?: number | string;
	isActive?: boolean;
};
function ScrollArea({children, height, isActive = true}: Props) {
	return (
		<ScrollAreaContextProvider>
			<ScrollController isActive={isActive} />
			<OuterBox height={height}>
				<InnerBox>{children}</InnerBox>
			</OuterBox>
		</ScrollAreaContextProvider>
	);
}

export default ScrollArea;
