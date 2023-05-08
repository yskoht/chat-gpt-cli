import React, {createContext, useMemo} from 'react';

import store, {Store} from './store.js';

// @ts-ignore
export const ScrollAreaContext = createContext<Store>(null);

type Props = {
	children: React.ReactNode;
};

function ScrollAreaContextProvider({children}: Props) {
	const _store = useMemo(store, []);
	return (
		<ScrollAreaContext.Provider value={_store}>
			{children}
		</ScrollAreaContext.Provider>
	);
}

export default ScrollAreaContextProvider;
