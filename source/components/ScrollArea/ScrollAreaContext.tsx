import React, {createContext} from 'react';

import store, {Store} from './store.js';

// @ts-ignore
export const ScrollAreaContext = createContext<Store>(null);

type Props = {
	children: React.ReactNode;
};

function ScrollAreaContextProvider({children}: Props) {
	return (
		<ScrollAreaContext.Provider value={store}>
			{children}
		</ScrollAreaContext.Provider>
	);
}

export default ScrollAreaContextProvider;
