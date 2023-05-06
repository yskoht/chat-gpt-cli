import React from 'react';

import LoggerContextProvider from './LoggerContext.js';

type Props = {
	debug: boolean;
	children: React.ReactNode;
};
function Logger({debug, children}: Props) {
	return (
		<LoggerContextProvider debug={debug}>{children}</LoggerContextProvider>
	);
}

export default Logger;
