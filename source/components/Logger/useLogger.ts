import {useContext} from 'react';
import {useStore} from 'zustand';

import {LoggerContext} from './LoggerContext.js';

function useLogger() {
	const store = useContext(LoggerContext);
	const {logger} = useStore(store, ({logger}) => ({
		logger,
	}));

	return logger;
}

export default useLogger;
