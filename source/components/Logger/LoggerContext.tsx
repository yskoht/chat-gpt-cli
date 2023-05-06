import React, {createContext, useMemo} from 'react';

import store, {Store} from './store.js';

// @ts-ignore
export const LoggerContext = createContext<Store>(null);

type Props = {
	debug: boolean;
	children: React.ReactNode;
};

function LoggerContextProvider({debug, children}: Props) {
	const _store = useMemo(() => store(debug), [debug]);
	return (
		<LoggerContext.Provider value={_store}>{children}</LoggerContext.Provider>
	);
}

export default LoggerContextProvider;
